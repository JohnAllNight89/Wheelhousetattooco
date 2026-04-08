import { Router, type IRouter } from "express";
import { db, eventsTable, artistEventSignupsTable, artistsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "./auth";
import {
  ListEventsQueryParams,
  CreateEventBody,
  GetEventParams,
  UpdateEventParams,
  UpdateEventBody,
  DeleteEventParams,
  SignUpForEventParams,
  WithdrawFromEventParams,
  GetEventSignupsParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function formatEvent(e: typeof eventsTable.$inferSelect) {
  return {
    id: e.id,
    title: e.title,
    description: e.description ?? null,
    state: e.state,
    city: e.city,
    venue: e.venue ?? null,
    packageType: e.packageType,
    eventDate: e.eventDate.toISOString(),
    artistSlots: e.artistSlots,
    signedUpCount: e.signedUpCount,
    status: e.status,
    notes: e.notes ?? null,
    createdAt: e.createdAt.toISOString(),
  };
}

router.get("/events", async (req, res) => {
  try {
    const params = ListEventsQueryParams.parse(req.query);
    let all = await db.select().from(eventsTable).orderBy(eventsTable.eventDate);
    if (params.state) {
      all = all.filter((e) => e.state.toLowerCase() === (params.state as string).toLowerCase());
    }
    if (params.packageType) {
      all = all.filter((e) => e.packageType === params.packageType);
    }
    if (params.upcoming) {
      const now = new Date();
      all = all.filter((e) => e.eventDate > now);
    }
    res.json(all.map(formatEvent));
  } catch (err) {
    res.status(500).json({ error: "Failed to list events" });
  }
});

router.post("/events", async (req, res) => {
  try {
    const body = CreateEventBody.parse(req.body);
    const [event] = await db.insert(eventsTable).values({
      title: body.title,
      description: body.description ?? null,
      state: body.state,
      city: body.city,
      venue: body.venue ?? null,
      packageType: body.packageType,
      eventDate: new Date(body.eventDate),
      artistSlots: body.artistSlots,
      notes: body.notes ?? null,
      status: "open",
    }).returning();
    res.status(201).json(formatEvent(event));
  } catch (err) {
    res.status(400).json({ error: "Invalid event data" });
  }
});

router.get("/events/:id", async (req, res) => {
  try {
    const { id } = GetEventParams.parse({ id: Number(req.params.id) });
    const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, id));
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(formatEvent(event));
  } catch (err) {
    res.status(500).json({ error: "Failed to get event" });
  }
});

router.put("/events/:id", async (req, res) => {
  try {
    const { id } = UpdateEventParams.parse({ id: Number(req.params.id) });
    const body = UpdateEventBody.parse(req.body);
    const [event] = await db.update(eventsTable)
      .set({
        title: body.title,
        description: body.description ?? null,
        state: body.state,
        city: body.city,
        venue: body.venue ?? null,
        packageType: body.packageType,
        eventDate: new Date(body.eventDate),
        artistSlots: body.artistSlots,
        notes: body.notes ?? null,
      })
      .where(eq(eventsTable.id, id))
      .returning();
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(formatEvent(event));
  } catch (err) {
    res.status(400).json({ error: "Failed to update event" });
  }
});

router.delete("/events/:id", async (req, res) => {
  try {
    const { id } = DeleteEventParams.parse({ id: Number(req.params.id) });
    await db.delete(eventsTable).where(eq(eventsTable.id, id));
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete event" });
  }
});

router.post("/events/:id/signup", requireAuth, async (req, res) => {
  try {
    const { id } = SignUpForEventParams.parse({ id: Number(req.params.id) });
    const clerkId = req.auth?.userId;
    if (!clerkId) return res.status(401).json({ error: "Unauthorized" });

    const [artist] = await db.select().from(artistsTable).where(eq(artistsTable.clerkId, clerkId));
    if (!artist) return res.status(404).json({ error: "Artist profile not found" });

    const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, id));
    if (!event) return res.status(404).json({ error: "Event not found" });
    if (event.signedUpCount >= event.artistSlots) {
      return res.status(409).json({ error: "Event is full" });
    }

    const existing = await db.select().from(artistEventSignupsTable)
      .where(and(eq(artistEventSignupsTable.artistId, artist.id), eq(artistEventSignupsTable.eventId, id)));
    if (existing.length > 0) {
      return res.status(409).json({ error: "Already signed up for this event" });
    }

    const [signup] = await db.insert(artistEventSignupsTable).values({
      artistId: artist.id,
      eventId: id,
    }).returning();

    await db.update(eventsTable).set({ signedUpCount: event.signedUpCount + 1 }).where(eq(eventsTable.id, id));

    res.status(201).json({
      id: signup.id,
      artistId: signup.artistId,
      eventId: signup.eventId,
      artistStyles: artist.styles ?? [],
      artistName: artist.name,
      artistState: artist.state,
      artistInstagram: artist.instagramHandle ?? null,
      eventTitle: event.title,
      eventDate: event.eventDate.toISOString(),
      eventState: event.state,
      eventCity: event.city,
      eventPackageType: event.packageType,
      signedUpAt: signup.signedUpAt.toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to sign up for event" });
  }
});

router.delete("/events/:id/signup", requireAuth, async (req, res) => {
  try {
    const { id } = WithdrawFromEventParams.parse({ id: Number(req.params.id) });
    const clerkId = req.auth?.userId;
    if (!clerkId) return res.status(401).json({ error: "Unauthorized" });

    const [artist] = await db.select().from(artistsTable).where(eq(artistsTable.clerkId, clerkId));
    if (!artist) return res.status(404).json({ error: "Artist profile not found" });

    const deleted = await db.delete(artistEventSignupsTable)
      .where(and(eq(artistEventSignupsTable.artistId, artist.id), eq(artistEventSignupsTable.eventId, id)))
      .returning();

    if (deleted.length > 0) {
      const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, id));
      if (event && event.signedUpCount > 0) {
        await db.update(eventsTable).set({ signedUpCount: event.signedUpCount - 1 }).where(eq(eventsTable.id, id));
      }
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to withdraw from event" });
  }
});

router.get("/events/:id/signups", async (req, res) => {
  try {
    const { id } = GetEventSignupsParams.parse({ id: Number(req.params.id) });
    const signups = await db.select({
      id: artistEventSignupsTable.id,
      artistId: artistEventSignupsTable.artistId,
      eventId: artistEventSignupsTable.eventId,
      signedUpAt: artistEventSignupsTable.signedUpAt,
      artistName: artistsTable.name,
      artistState: artistsTable.state,
      artistStyles: artistsTable.styles,
      artistInstagram: artistsTable.instagramHandle,
    }).from(artistEventSignupsTable)
      .leftJoin(artistsTable, eq(artistEventSignupsTable.artistId, artistsTable.id))
      .where(eq(artistEventSignupsTable.eventId, id));

    const event = await db.select().from(eventsTable).where(eq(eventsTable.id, id));
    const ev = event[0];

    res.json(signups.map((s) => ({
      id: s.id,
      artistId: s.artistId,
      eventId: s.eventId,
      artistName: s.artistName ?? null,
      artistState: s.artistState ?? null,
      artistStyles: s.artistStyles ?? [],
      artistInstagram: s.artistInstagram ?? null,
      eventTitle: ev?.title ?? null,
      eventDate: ev?.eventDate.toISOString() ?? null,
      eventState: ev?.state ?? null,
      eventCity: ev?.city ?? null,
      eventPackageType: ev?.packageType ?? null,
      signedUpAt: s.signedUpAt.toISOString(),
    })));
  } catch (err) {
    res.status(500).json({ error: "Failed to get event signups" });
  }
});

export default router;
