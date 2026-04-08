import { Router, type IRouter } from "express";
import { db, rigsTable, eventsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateRigBody, UpdateRigParams, UpdateRigBody } from "@workspace/api-zod";

const router: IRouter = Router();

function formatRig(r: typeof rigsTable.$inferSelect, eventTitle?: string | null) {
  return {
    id: r.id,
    name: r.name,
    description: r.description ?? null,
    status: r.status,
    currentEventId: r.currentEventId ?? null,
    currentEventTitle: eventTitle ?? null,
    homeState: r.homeState,
    createdAt: r.createdAt.toISOString(),
  };
}

router.get("/rigs", async (_req, res) => {
  try {
    const rigs = await db.select({
      id: rigsTable.id,
      name: rigsTable.name,
      description: rigsTable.description,
      status: rigsTable.status,
      currentEventId: rigsTable.currentEventId,
      homeState: rigsTable.homeState,
      createdAt: rigsTable.createdAt,
      eventTitle: eventsTable.title,
    }).from(rigsTable)
      .leftJoin(eventsTable, eq(rigsTable.currentEventId, eventsTable.id));

    res.json(rigs.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description ?? null,
      status: r.status,
      currentEventId: r.currentEventId ?? null,
      currentEventTitle: r.eventTitle ?? null,
      homeState: r.homeState,
      createdAt: r.createdAt.toISOString(),
    })));
  } catch (err) {
    res.status(500).json({ error: "Failed to list rigs" });
  }
});

router.post("/rigs", async (req, res) => {
  try {
    const body = CreateRigBody.parse(req.body);
    const [rig] = await db.insert(rigsTable).values({
      name: body.name,
      description: body.description ?? null,
      status: body.status ?? "available",
      currentEventId: body.currentEventId ?? null,
      homeState: body.homeState,
    }).returning();
    res.status(201).json(formatRig(rig));
  } catch (err) {
    res.status(400).json({ error: "Invalid rig data" });
  }
});

router.put("/rigs/:id", async (req, res) => {
  try {
    const { id } = UpdateRigParams.parse({ id: Number(req.params.id) });
    const body = UpdateRigBody.parse(req.body);
    const [rig] = await db.update(rigsTable).set({
      name: body.name,
      description: body.description ?? null,
      status: body.status ?? "available",
      currentEventId: body.currentEventId ?? null,
      homeState: body.homeState,
    }).where(eq(rigsTable.id, id)).returning();
    if (!rig) return res.status(404).json({ error: "Rig not found" });
    res.json(formatRig(rig));
  } catch (err) {
    res.status(400).json({ error: "Failed to update rig" });
  }
});

export default router;
