import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const inquiriesTable = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  contactName: text("contact_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  eventName: text("event_name"),
  eventDate: timestamp("event_date"),
  eventState: text("event_state").notNull(),
  eventCity: text("event_city").notNull(),
  expectedAttendees: integer("expected_attendees"),
  packageType: text("package_type").notNull(),
  message: text("message"),
  status: text("status").notNull().default("new"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertInquirySchema = createInsertSchema(inquiriesTable).omit({ id: true, createdAt: true, status: true, adminNotes: true });
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Inquiry = typeof inquiriesTable.$inferSelect;
