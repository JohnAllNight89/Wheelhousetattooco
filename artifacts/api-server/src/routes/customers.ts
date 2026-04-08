import { Router } from "express";
import { db } from "@workspace/db";
import { customersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "./auth";
import { UpsertMyCustomerProfileBody } from "@workspace/api-zod";

const router = Router();

function formatCustomer(c: typeof customersTable.$inferSelect) {
  return {
    id: c.id,
    clerkId: c.clerkId,
    name: c.name,
    email: c.email,
    phone: c.phone ?? null,
    createdAt: c.createdAt.toISOString(),
  };
}

router.get("/customers/me", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkUserId;
    const [customer] = await db.select().from(customersTable).where(eq(customersTable.clerkId, clerkId));
    if (!customer) {
      res.status(404).json({ error: "Customer profile not found" });
      return;
    }
    res.json(formatCustomer(customer));
  } catch (err) {
    res.status(500).json({ error: "Failed to get customer profile" });
  }
});

router.put("/customers/me", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkUserId;
    const parsed = UpsertMyCustomerProfileBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    const data = parsed.data;

    const [existing] = await db.select().from(customersTable).where(eq(customersTable.clerkId, clerkId));

    let customer;
    if (existing) {
      [customer] = await db
        .update(customersTable)
        .set({ name: data.name, phone: data.phone ?? null })
        .where(eq(customersTable.clerkId, clerkId))
        .returning();
    } else {
      const email = `${clerkId}@customer.wheelhouse.app`;
      [customer] = await db
        .insert(customersTable)
        .values({ clerkId, name: data.name, email, phone: data.phone ?? null })
        .returning();
    }

    res.json(formatCustomer(customer));
  } catch (err) {
    res.status(500).json({ error: "Failed to upsert customer profile" });
  }
});

export default router;
