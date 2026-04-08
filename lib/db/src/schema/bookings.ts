import { pgTable, serial, integer, text, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { customersTable } from "./customers";
import { artistsTable } from "./artists";
import { servicesTable } from "./services";

export const bookingStatusEnum = ["pending", "confirmed", "completed", "cancelled"] as const;
export type BookingStatus = typeof bookingStatusEnum[number];

export const bookingsTable = pgTable("bookings", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull().references(() => customersTable.id, { onDelete: "cascade" }),
  artistId: integer("artist_id").notNull().references(() => artistsTable.id, { onDelete: "cascade" }),
  serviceId: integer("service_id").references(() => servicesTable.id, { onDelete: "set null" }),
  status: text("status").notNull().default("pending"),
  scheduledAt: timestamp("scheduled_at"),
  notes: text("notes"),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({ id: true, createdAt: true });
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookingsTable.$inferSelect;
