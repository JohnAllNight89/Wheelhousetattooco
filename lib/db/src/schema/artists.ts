import { pgTable, serial, text, integer, boolean, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const artistsTable = pgTable("artists", {
  id: serial("id").primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  name: text("name").notNull(),
  bio: text("bio"),
  email: text("email").notNull(),
  phone: text("phone"),
  state: text("state").notNull(),
  city: text("city").notNull(),
  styles: text("styles").array().notNull().default([]),
  portfolioImages: text("portfolio_images").array().notNull().default([]),
  hourlyRate: numeric("hourly_rate", { precision: 10, scale: 2 }),
  available: boolean("available").notNull().default(true),
  instagramHandle: text("instagram_handle"),
  yearsExperience: integer("years_experience"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertArtistSchema = createInsertSchema(artistsTable).omit({ id: true, createdAt: true });
export type InsertArtist = z.infer<typeof insertArtistSchema>;
export type Artist = typeof artistsTable.$inferSelect;
