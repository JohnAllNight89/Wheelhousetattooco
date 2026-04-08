import { Router, type IRouter } from "express";
import { db, inquiriesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateInquiryBody, ListInquiriesQueryParams, GetInquiryParams, UpdateInquiryStatusParams, UpdateInquiryStatusBody } from "@workspace/api-zod";

const router: IRouter = Router();

function formatInquiry(i: typeof inquiriesTable.$inferSelect) {
  return {
    id: i.id,
    contactName: i.contactName,
    contactEmail: i.contactEmail,
    contactPhone: i.contactPhone ?? null,
    eventName: i.eventName ?? null,
    eventDate: i.eventDate ? i.eventDate.toISOString() : null,
    eventState: i.eventState,
    eventCity: i.eventCity,
    expectedAttendees: i.expectedAttendees ?? null,
    packageType: i.packageType,
    message: i.message ?? null,
    status: i.status,
    adminNotes: i.adminNotes ?? null,
    createdAt: i.createdAt.toISOString(),
  };
}

router.post("/inquiries", async (req, res) => {
  try {
    const body = CreateInquiryBody.parse(req.body);
    const [inquiry] = await db.insert(inquiriesTable).values({
      contactName: body.contactName,
      contactEmail: body.contactEmail,
      contactPhone: body.contactPhone ?? null,
      eventName: body.eventName ?? null,
      eventDate: body.eventDate ? new Date(body.eventDate) : null,
      eventState: body.eventState,
      eventCity: body.eventCity,
      expectedAttendees: body.expectedAttendees ?? null,
      packageType: body.packageType,
      message: body.message ?? null,
      status: "new",
    }).returning();
    res.status(201).json(formatInquiry(inquiry));
  } catch (err) {
    res.status(400).json({ error: "Invalid inquiry data" });
  }
});

router.get("/inquiries", async (req, res) => {
  try {
    const params = ListInquiriesQueryParams.parse(req.query);
    let all = await db.select().from(inquiriesTable).orderBy(inquiriesTable.createdAt);
    if (params.status) {
      all = all.filter((i) => i.status === params.status);
    }
    if (params.state) {
      all = all.filter((i) => i.eventState.toLowerCase() === (params.state as string).toLowerCase());
    }
    if (params.packageType) {
      all = all.filter((i) => i.packageType === params.packageType);
    }
    res.json(all.map(formatInquiry));
  } catch (err) {
    res.status(500).json({ error: "Failed to list inquiries" });
  }
});

router.get("/inquiries/:id", async (req, res) => {
  try {
    const { id } = GetInquiryParams.parse({ id: Number(req.params.id) });
    const [inquiry] = await db.select().from(inquiriesTable).where(eq(inquiriesTable.id, id));
    if (!inquiry) return res.status(404).json({ error: "Inquiry not found" });
    res.json(formatInquiry(inquiry));
  } catch (err) {
    res.status(500).json({ error: "Failed to get inquiry" });
  }
});

router.patch("/inquiries/:id", async (req, res) => {
  try {
    const { id } = UpdateInquiryStatusParams.parse({ id: Number(req.params.id) });
    const body = UpdateInquiryStatusBody.parse(req.body);
    const [inquiry] = await db.update(inquiriesTable)
      .set({
        status: body.status,
        adminNotes: body.adminNotes ?? undefined,
      })
      .where(eq(inquiriesTable.id, id))
      .returning();
    if (!inquiry) return res.status(404).json({ error: "Inquiry not found" });
    res.json(formatInquiry(inquiry));
  } catch (err) {
    res.status(400).json({ error: "Failed to update inquiry" });
  }
});

export default router;
