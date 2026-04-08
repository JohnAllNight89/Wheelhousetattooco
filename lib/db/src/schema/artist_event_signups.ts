import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { artistsTable } from "./artists";
import { eventsTable } from "./events";

export const artistEventSignupsTable = pgTable("artist_event_signups", {
  id: serial("id").primaryKey(),
  artistId: integer("artist_id").notNull().references(() => artistsTable.id, { onDelete: "cascade" }),
  eventId: integer("event_id").notNull().references(() => eventsTable.id, { onDelete: "cascade" }),
  signedUpAt: timestamp("signed_up_at").notNull().defaultNow(),
});

export const insertArtistEventSignupSchema = createInsertSchema(artistEventSignupsTable).omit({ id: true, signedUpAt: true });
export type InsertArtistEventSignup = z.infer<typeof insertArtistEventSignupSchema>;
export type ArtistEventSignup = typeof artistEventSignupsTable.$inferSelect;
