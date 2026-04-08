import { Router } from "express";
import { db } from "@workspace/db";
import { artistsTable, servicesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "./auth";
import { CreateServiceBody, UpdateServiceBody } from "@workspace/api-zod";

const router = Router();

function formatService(s: typeof servicesTable.$inferSelect) {
  return {
    id: s.id,
    artistId: s.artistId,
    name: s.name,
    description: s.description ?? null,
    price: Number(s.price),
    durationMinutes: s.durationMinutes,
    category: s.category,
    createdAt: s.createdAt.toISOString(),
  };
}

router.get("/artists/:id/services", async (req, res) => {
  try {
    const artistId = Number(req.params.id);
    const services = await db.select().from(servicesTable).where(eq(servicesTable.artistId, artistId));
    res.json(services.map(formatService));
  } catch (err) {
    res.status(500).json({ error: "Failed to get services" });
  }
});

router.get("/services/mine", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkUserId;
    const [artist] = await db.select().from(artistsTable).where(eq(artistsTable.clerkId, clerkId));
    if (!artist) {
      res.json([]);
      return;
    }
    const services = await db.select().from(servicesTable).where(eq(servicesTable.artistId, artist.id));
    res.json(services.map(formatService));
  } catch (err) {
    res.status(500).json({ error: "Failed to get my services" });
  }
});

router.post("/services", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkUserId;
    const [artist] = await db.select().from(artistsTable).where(eq(artistsTable.clerkId, clerkId));
    if (!artist) {
      res.status(404).json({ error: "Artist profile not found. Create your profile first." });
      return;
    }

    const parsed = CreateServiceBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    const data = parsed.data;

    const [service] = await db
      .insert(servicesTable)
      .values({
        artistId: artist.id,
        name: data.name,
        description: data.description ?? null,
        price: data.price.toString(),
        durationMinutes: data.durationMinutes,
        category: data.category,
      })
      .returning();

    res.status(201).json(formatService(service));
  } catch (err) {
    res.status(500).json({ error: "Failed to create service" });
  }
});

router.patch("/services/:id", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkUserId;
    const serviceId = Number(req.params.id);
    const [artist] = await db.select().from(artistsTable).where(eq(artistsTable.clerkId, clerkId));
    if (!artist) {
      res.status(404).json({ error: "Artist not found" });
      return;
    }

    const [existing] = await db.select().from(servicesTable).where(eq(servicesTable.id, serviceId));
    if (!existing || existing.artistId !== artist.id) {
      res.status(404).json({ error: "Service not found" });
      return;
    }

    const parsed = UpdateServiceBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    const data = parsed.data;

    const updates: Record<string, unknown> = {};
    if (data.name !== undefined) updates.name = data.name;
    if (data.description !== undefined) updates.description = data.description;
    if (data.price !== undefined) updates.price = data.price.toString();
    if (data.durationMinutes !== undefined) updates.durationMinutes = data.durationMinutes;
    if (data.category !== undefined) updates.category = data.category;

    const [service] = await db.update(servicesTable).set(updates).where(eq(servicesTable.id, serviceId)).returning();
    res.json(formatService(service));
  } catch (err) {
    res.status(500).json({ error: "Failed to update service" });
  }
});

router.delete("/services/:id", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkUserId;
    const serviceId = Number(req.params.id);
    const [artist] = await db.select().from(artistsTable).where(eq(artistsTable.clerkId, clerkId));
    if (!artist) {
      res.status(404).json({ error: "Artist not found" });
      return;
    }
    const [existing] = await db.select().from(servicesTable).where(eq(servicesTable.id, serviceId));
    if (!existing || existing.artistId !== artist.id) {
      res.status(404).json({ error: "Service not found" });
      return;
    }
    await db.delete(servicesTable).where(eq(servicesTable.id, serviceId));
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete service" });
  }
});

export default router;
