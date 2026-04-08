import { Router, type IRouter } from "express";
import { db, artistsTable, inquiriesTable, eventsTable, rigsTable, artistEventSignupsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { AdminListArtistsQueryParams, AdminUpdateArtistParams, AdminUpdateArtistBody } from "@workspace/api-zod";
import { formatArtist } from "./artists";

const router: IRouter = Router();

router.get("/admin/dashboard", async (_req, res) => {
  try {
    const [artists, inquiries, events, rigs, signups] = await Promise.all([
      db.select().from(artistsTable),
      db.select().from(inquiriesTable),
      db.select().from(eventsTable),
      db.select().from(rigsTable),
      db.select().from(artistEventSignupsTable),
    ]);

    const now = new Date();

    res.json({
      totalArtists: artists.length,
      approvedArtists: artists.filter((a) => a.approved).length,
      pendingArtists: artists.filter((a) => !a.approved).length,
      totalInquiries: inquiries.length,
      newInquiries: inquiries.filter((i) => i.status === "new").length,
      bookedInquiries: inquiries.filter((i) => i.status === "booked").length,
      totalEvents: events.length,
      upcomingEvents: events.filter((e) => e.eventDate > now).length,
      openEvents: events.filter((e) => e.status === "open").length,
      totalRigs: rigs.length,
      availableRigs: rigs.filter((r) => r.status === "available").length,
      deployedRigs: rigs.filter((r) => r.status === "deployed").length,
      totalSignups: signups.length,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to get dashboard" });
  }
});

router.get("/admin/artists", async (req, res) => {
  try {
    const params = AdminListArtistsQueryParams.parse(req.query);
    let artists = await db.select().from(artistsTable);
    if (params.state) {
      artists = artists.filter((a) => a.state.toLowerCase() === (params.state as string).toLowerCase());
    }
    if (params.available !== undefined) {
      artists = artists.filter((a) => a.available === params.available);
    }
    res.json(artists.map(formatArtist));
  } catch (err) {
    res.status(500).json({ error: "Failed to list artists" });
  }
});

router.patch("/admin/artists/:id", async (req, res) => {
  try {
    const { id } = AdminUpdateArtistParams.parse({ id: Number(req.params.id) });
    const body = AdminUpdateArtistBody.parse(req.body);
    const updateData: Record<string, unknown> = {};
    if (body.approved !== undefined) updateData.approved = body.approved;
    if (body.available !== undefined) updateData.available = body.available;
    const [artist] = await db.update(artistsTable).set(updateData).where(eq(artistsTable.id, id)).returning();
    if (!artist) return res.status(404).json({ error: "Artist not found" });
    res.json(formatArtist(artist));
  } catch (err) {
    res.status(400).json({ error: "Failed to update artist" });
  }
});

export default router;
