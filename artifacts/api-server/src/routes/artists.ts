import { Router } from "express";
import { db } from "@workspace/db";
import { artistsTable } from "@workspace/db";
import { eq, and, arrayContains, sql } from "drizzle-orm";
import { requireAuth } from "./auth";
import { UpsertMyArtistProfileBody } from "@workspace/api-zod";

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
    hourlyRate: a.hourlyRate ? Number(a.hourlyRate) : null,
    available: a.available,
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
    const clerkId = (req as any).clerkUserId;
    const [artist] = await db.select().from(artistsTable).where(eq(artistsTable.clerkId, clerkId));
    if (!artist) {
      res.status(404).json({ error: "Artist profile not found" });
      return;
    }
    res.json(formatArtist(artist));
  } catch (err) {
    res.status(500).json({ error: "Failed to get artist profile" });
  }
});

router.put("/artists/me", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkUserId;
    const parsed = UpsertMyArtistProfileBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
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
          hourlyRate: data.hourlyRate?.toString() ?? null,
          available: data.available,
          instagramHandle: data.instagramHandle ?? null,
          yearsExperience: data.yearsExperience ?? null,
        })
        .where(eq(artistsTable.clerkId, clerkId))
        .returning();
    } else {
      const auth = await import("@clerk/express").then((m) => m.getAuth(req as any));
      const email = req.headers["x-clerk-email"] as string || `${clerkId}@artist.wheelhouse.app`;
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
          hourlyRate: data.hourlyRate?.toString() ?? null,
          available: data.available,
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

router.get("/artists/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [artist] = await db.select().from(artistsTable).where(eq(artistsTable.id, id));
    if (!artist) {
      res.status(404).json({ error: "Artist not found" });
      return;
    }
    res.json(formatArtist(artist));
  } catch (err) {
    res.status(500).json({ error: "Failed to get artist" });
  }
});

export default router;
