import express from "express";
import Lead from "../models/Lead.js";
import sanitize from "mongo-sanitize";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Rate limit
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: "Too many requests" },
});

// CREATE lead (public)
router.post("/", limiter, async (req, res) => {
  try {
    let { contact } = req.body;
    if (!contact) {
      return res.status(400).json({ error: "Contact is required" });
    }

    contact = sanitize(contact);
    const lead = await Lead.create({ contact });

    res.status(201).json(lead);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save lead" });
  }
});

// FETCH ALL LEADS (admin panel)
router.get("/", async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch leads" });
  }
});

export default router;
