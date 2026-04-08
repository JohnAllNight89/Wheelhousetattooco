import { Router } from "express";
import { db } from "@workspace/db";
import { artistsTable, bookingsTable, customersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "./auth";

const router = Router();

router.get("/dashboard/artist", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkUserId;
    const [artist] = await db.select().from(artistsTable).where(eq(artistsTable.clerkId, clerkId));
    if (!artist) {
      res.json({
        totalBookings: 0,
        pendingBookings: 0,
        confirmedBookings: 0,
        completedBookings: 0,
        totalRevenue: 0,
        recentBookings: [],
      });
      return;
    }

    const bookings = await db.select().from(bookingsTable).where(eq(bookingsTable.artistId, artist.id));
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter((b) => b.status === "pending").length;
    const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length;
    const completedBookings = bookings.filter((b) => b.status === "completed").length;
    const totalRevenue = bookings
      .filter((b) => b.status === "completed" && b.totalPrice)
      .reduce((sum, b) => sum + Number(b.totalPrice), 0);

    const recentBookings = bookings
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5)
      .map((b) => ({
        id: b.id,
        customerId: b.customerId,
        artistId: b.artistId,
        serviceId: b.serviceId ?? null,
        status: b.status,
        scheduledAt: b.scheduledAt ? b.scheduledAt.toISOString() : null,
        notes: b.notes ?? null,
        totalPrice: b.totalPrice ? Number(b.totalPrice) : null,
        customerName: null,
        artistName: artist.name,
        serviceName: null,
        createdAt: b.createdAt.toISOString(),
      }));

    res.json({ totalBookings, pendingBookings, confirmedBookings, completedBookings, totalRevenue, recentBookings });
  } catch (err) {
    res.status(500).json({ error: "Failed to get artist dashboard" });
  }
});

router.get("/dashboard/customer", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkUserId;
    const [customer] = await db.select().from(customersTable).where(eq(customersTable.clerkId, clerkId));
    if (!customer) {
      res.json({
        totalBookings: 0,
        upcomingBookings: 0,
        completedBookings: 0,
        recentBookings: [],
      });
      return;
    }

    const bookings = await db.select().from(bookingsTable).where(eq(bookingsTable.customerId, customer.id));
    const totalBookings = bookings.length;
    const completedBookings = bookings.filter((b) => b.status === "completed").length;
    const upcomingBookings = bookings.filter(
      (b) => b.status === "confirmed" && b.scheduledAt && new Date(b.scheduledAt) > new Date()
    ).length;

    const recentBookings = bookings
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5)
      .map((b) => ({
        id: b.id,
        customerId: b.customerId,
        artistId: b.artistId,
        serviceId: b.serviceId ?? null,
        status: b.status,
        scheduledAt: b.scheduledAt ? b.scheduledAt.toISOString() : null,
        notes: b.notes ?? null,
        totalPrice: b.totalPrice ? Number(b.totalPrice) : null,
        customerName: customer.name,
        artistName: null,
        serviceName: null,
        createdAt: b.createdAt.toISOString(),
      }));

    res.json({ totalBookings, upcomingBookings, completedBookings, recentBookings });
  } catch (err) {
    res.status(500).json({ error: "Failed to get customer dashboard" });
  }
});

export default router;
