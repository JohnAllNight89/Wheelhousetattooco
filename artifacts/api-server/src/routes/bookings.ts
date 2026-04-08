import { Router } from "express";
import { db } from "@workspace/db";
import { artistsTable, bookingsTable, customersTable, servicesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "./auth";
import { CreateBookingBody, UpdateBookingStatusBody, ListBookingsQueryParams } from "@workspace/api-zod";

const router = Router();

async function formatBooking(b: typeof bookingsTable.$inferSelect) {
  const [customer] = await db.select({ name: customersTable.name }).from(customersTable).where(eq(customersTable.id, b.customerId));
  const [artist] = await db.select({ name: artistsTable.name }).from(artistsTable).where(eq(artistsTable.id, b.artistId));
  const service = b.serviceId
    ? (await db.select({ name: servicesTable.name }).from(servicesTable).where(eq(servicesTable.id, b.serviceId)))[0]
    : null;

  return {
    id: b.id,
    customerId: b.customerId,
    artistId: b.artistId,
    serviceId: b.serviceId ?? null,
    status: b.status,
    scheduledAt: b.scheduledAt ? b.scheduledAt.toISOString() : null,
    notes: b.notes ?? null,
    totalPrice: b.totalPrice ? Number(b.totalPrice) : null,
    customerName: customer?.name ?? null,
    artistName: artist?.name ?? null,
    serviceName: service?.name ?? null,
    createdAt: b.createdAt.toISOString(),
  };
}

router.get("/bookings", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkUserId;
    const { status } = req.query as Record<string, string | undefined>;

    const [artist] = await db.select().from(artistsTable).where(eq(artistsTable.clerkId, clerkId));
    const [customer] = await db.select().from(customersTable).where(eq(customersTable.clerkId, clerkId));

    let bookings: (typeof bookingsTable.$inferSelect)[] = [];

    if (artist) {
      bookings = await db.select().from(bookingsTable).where(eq(bookingsTable.artistId, artist.id));
    } else if (customer) {
      bookings = await db.select().from(bookingsTable).where(eq(bookingsTable.customerId, customer.id));
    }

    if (status) {
      bookings = bookings.filter((b) => b.status === status);
    }

    const formatted = await Promise.all(bookings.map(formatBooking));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: "Failed to list bookings" });
  }
});

router.post("/bookings", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkUserId;
    const parsed = CreateBookingBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    const data = parsed.data;

    let [customer] = await db.select().from(customersTable).where(eq(customersTable.clerkId, clerkId));
    if (!customer) {
      [customer] = await db
        .insert(customersTable)
        .values({ clerkId, name: "Guest", email: `${clerkId}@customer.wheelhouse.app` })
        .returning();
    }

    const [booking] = await db
      .insert(bookingsTable)
      .values({
        customerId: customer.id,
        artistId: data.artistId,
        serviceId: data.serviceId ?? null,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        notes: data.notes ?? null,
        totalPrice: data.totalPrice?.toString() ?? null,
        status: "pending",
      })
      .returning();

    const formatted = await formatBooking(booking);
    res.status(201).json(formatted);
  } catch (err) {
    res.status(500).json({ error: "Failed to create booking" });
  }
});

router.get("/bookings/:id", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [booking] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, id));
    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }
    res.json(await formatBooking(booking));
  } catch (err) {
    res.status(500).json({ error: "Failed to get booking" });
  }
});

router.patch("/bookings/:id/status", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkUserId;
    const id = Number(req.params.id);

    const parsed = UpdateBookingStatusBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    const [existing] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, id));
    if (!existing) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    const [booking] = await db
      .update(bookingsTable)
      .set({ status: parsed.data.status })
      .where(eq(bookingsTable.id, id))
      .returning();

    res.json(await formatBooking(booking));
  } catch (err) {
    res.status(500).json({ error: "Failed to update booking status" });
  }
});

export default router;
