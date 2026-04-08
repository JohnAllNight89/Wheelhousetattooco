import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { eventsTable } from "./events";

export const rigsTable = pgTable("rigs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("available"),
  currentEventId: integer("current_event_id").references(() => eventsTable.id, { onDelete: "set null" }),
  homeState: text("home_state").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertRigSchema = createInsertSchema(rigsTable).omit({ id: true, createdAt: true });
export type InsertRig = z.infer<typeof insertRigSchema>;
export type Rig = typeof rigsTable.$inferSelect;
