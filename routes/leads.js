import express from "express";
import Lead from "../models/Lead.js";
import sanitize from "mongo-sanitize";
import rateLimit from "express-rate-limit";

const router = express.Router();

// ✅ Rate limiting (per endpoint)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10,
  message: { error: "Too many requests, please try again later." }
});

router.post("/", limiter, async (req, res) => {
  try {
    let { contact } = req.body;
    if (!contact) return res.status(400).json({ error: "Contact is required" });

    // Sanitize input
    contact = sanitize(contact);

    const lead = await Lead.create({ contact });
    res.status(201).json({ message: "Lead saved successfully", lead });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save lead" });
  }
});

export default router;
