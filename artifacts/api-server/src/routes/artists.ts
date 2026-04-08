import { Router } from "express";
import { db } from "@workspace/db";
import { artistsTable, artistEventSignupsTable, eventsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "./auth";
import { UpsertMyArtistProfileBody } from "@workspace/api-zod";
import { getAuth } from "@clerk/express";

const router = Router();

function formatArtist(a: typeof artistsTable.$inferSelect) {
  return {
    id: a.id,
    clerkId: a.clerkId,
    name: a.name,
    bio: a.bio ?? null,
    email: a.email,
    phone: a.phone ?? null,
    state: a.state,
    city: a.city,
    styles: a.styles ?? [],
    portfolioImages: a.portfolioImages ?? [],
    available: a.available,
    approved: a.approved,
    instagramHandle: a.instagramHandle ?? null,
    yearsExperience: a.yearsExperience ?? null,
    createdAt: a.createdAt.toISOString(),
  };
}

router.get("/artists", async (req, res) => {
  try {
    const { state, city, style } = req.query as Record<string, string | undefined>;
    let artists = await db.select().from(artistsTable);

    if (state) {
      artists = artists.filter((a) => a.state.toLowerCase() === state.toLowerCase());
    }
    if (city) {
      artists = artists.filter((a) => a.city.toLowerCase() === city.toLowerCase());
    }
    if (style) {
      artists = artists.filter((a) =>
        a.styles.some((s) => s.toLowerCase().includes(style.toLowerCase()))
      );
    }

    res.json(artists.map(formatArtist));
  } catch (err) {
    res.status(500).json({ error: "Failed to list artists" });
  }
});

router.get("/artists/locations", async (_req, res) => {
  try {
    const artists = await db.select({
      state: artistsTable.state,
      city: artistsTable.city,
    }).from(artistsTable);

    const byState: Record<string, Set<string>> = {};
    for (const a of artists) {
      if (!byState[a.state]) byState[a.state] = new Set();
      byState[a.state].add(a.city);
    }

    const locations = Object.entries(byState).map(([state, cities]) => ({
      state,
      cities: Array.from(cities),
      artistCount: artists.filter((a) => a.state === state).length,
    }));

    res.json({ locations });
  } catch (err) {
    res.status(500).json({ error: "Failed to get locations" });
  }
});

router.get("/artists/me", requireAuth, async (req, res) => {
  try {
    const auth = getAuth(req);
    const clerkId = auth.userId;
    if (!clerkId) return res.status(401).json({ error: "Unauthorized" });
    const [artist] = await db.select().from(artistsTable).where(eq(artistsTable.clerkId, clerkId));
    if (!artist) {
      return res.status(404).json({ error: "Artist profile not found" });
    }
    res.json(formatArtist(artist));
  } catch (err) {
    res.status(500).json({ error: "Failed to get artist profile" });
  }
});

router.put("/artists/me", requireAuth, async (req, res) => {
  try {
    const auth = getAuth(req);
    const clerkId = auth.userId;
    if (!clerkId) return res.status(401).json({ error: "Unauthorized" });

    const parsed = UpsertMyArtistProfileBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request body" });
    }
    const data = parsed.data;

    const [existing] = await db.select().from(artistsTable).where(eq(artistsTable.clerkId, clerkId));

    let artist;
    if (existing) {
      [artist] = await db
        .update(artistsTable)
        .set({
          name: data.name,
          bio: data.bio ?? null,
          phone: data.phone ?? null,
          state: data.state,
          city: data.city,
          styles: data.styles,
          portfolioImages: data.portfolioImages ?? [],
          available: data.available,
          instagramHandle: data.instagramHandle ?? null,
          yearsExperience: data.yearsExperience ?? null,
        })
        .where(eq(artistsTable.clerkId, clerkId))
        .returning();
    } else {
      const clerkUser = await fetch(`https://api.clerk.com/v1/users/${clerkId}`, {
        headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` },
      }).then((r) => r.json()).catch(() => null);
      const email = clerkUser?.email_addresses?.[0]?.email_address ?? `${clerkId}@artist.wheelhouse.app`;

      [artist] = await db
        .insert(artistsTable)
        .values({
          clerkId,
          name: data.name,
          bio: data.bio ?? null,
          email,
          phone: data.phone ?? null,
          state: data.state,
          city: data.city,
          styles: data.styles,
          portfolioImages: data.portfolioImages ?? [],
          available: data.available,
          approved: false,
          instagramHandle: data.instagramHandle ?? null,
          yearsExperience: data.yearsExperience ?? null,
        })
        .returning();
    }

    res.json(formatArtist(artist));
  } catch (err) {
    res.status(500).json({ error: "Failed to upsert artist profile" });
  }
});

router.get("/artists/me/events", requireAuth, async (req, res) => {
  try {
    const auth = getAuth(req);
    const clerkId = auth.userId;
    if (!clerkId) return res.status(401).json({ error: "Unauthorized" });

    const [artist] = await db.select().from(artistsTable).where(eq(artistsTable.clerkId, clerkId));
    if (!artist) return res.status(404).json({ error: "Artist profile not found" });

    const signups = await db.select({
      id: artistEventSignupsTable.id,
      artistId: artistEventSignupsTable.artistId,
      eventId: artistEventSignupsTable.eventId,
      signedUpAt: artistEventSignupsTable.signedUpAt,
      eventTitle: eventsTable.title,
      eventDate: eventsTable.eventDate,
      eventState: eventsTable.state,
      eventCity: eventsTable.city,
      eventPackageType: eventsTable.packageType,
    }).from(artistEventSignupsTable)
      .leftJoin(eventsTable, eq(artistEventSignupsTable.eventId, eventsTable.id))
      .where(eq(artistEventSignupsTable.artistId, artist.id));

    res.json(signups.map((s) => ({
      id: s.id,
      artistId: s.artistId,
      eventId: s.eventId,
      artistName: artist.name,
      artistState: artist.state,
      artistStyles: artist.styles ?? [],
      artistInstagram: artist.instagramHandle ?? null,
      eventTitle: s.eventTitle ?? null,
      eventDate: s.eventDate?.toISOString() ?? null,
      eventState: s.eventState ?? null,
      eventCity: s.eventCity ?? null,
      eventPackageType: s.eventPackageType ?? null,
      signedUpAt: s.signedUpAt.toISOString(),
    })));
  } catch (err) {
    res.status(500).json({ error: "Failed to get event signups" });
  }
});

export { formatArtist };
export default router;
