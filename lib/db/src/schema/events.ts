import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const eventsTable = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  state: text("state").notNull(),
  city: text("city").notNull(),
  venue: text("venue"),
  packageType: text("package_type").notNull(),
  eventDate: timestamp("event_date").notNull(),
  artistSlots: integer("artist_slots").notNull(),
  signedUpCount: integer("signed_up_count").notNull().default(0),
  status: text("status").notNull().default("open"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEventSchema = createInsertSchema(eventsTable).omit({ id: true, createdAt: true, signedUpCount: true });
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof eventsTable.$inferSelect;
