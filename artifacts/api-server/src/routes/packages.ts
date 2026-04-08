import { Router, type IRouter } from "express";

const router: IRouter = Router();

const PACKAGES = [
  {
    id: "A",
    name: "Package A — Concert & Upscale",
    description: "Full fleet deployment for large-scale concerts, festivals, and upscale events with special guests.",
    rigCount: 3,
    artistSlots: 9,
    idealFor: ["Concerts", "Music Festivals", "Upscale Events", "Special Guests", "Corporate Events"],
    priceNote: "Contact us for pricing",
  },
  {
    id: "B",
    name: "Package B — Parties & Events",
    description: "Two-rig setup ideal for parties, mid-size gatherings, and special occasions.",
    rigCount: 2,
    artistSlots: 6,
    idealFor: ["Birthday Parties", "Bachelorette Events", "Block Parties", "Brand Activations"],
    priceNote: "Contact us for pricing",
  },
  {
    id: "C",
    name: "Package C — Intimate Events",
    description: "Single-rig experience for smaller parties, pop-ups, and intimate gatherings.",
    rigCount: 1,
    artistSlots: 3,
    idealFor: ["Small Parties", "Pop-Up Events", "Private Gatherings", "Bar Events"],
    priceNote: "Contact us for pricing",
  },
];

router.get("/packages", (_req, res) => {
  res.json(PACKAGES);
});

export default router;
