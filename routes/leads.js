import express from "express";
import Lead from "../models/Lead.js";
import sanitize from "mongo-sanitize";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Basic rate limiting to prevent spam/flooding
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
  message: { error: "Too many requests, please try again later." }
});

router.post("/", limiter, async (req, res) => {
  try {
    let { contact } = req.body;
    if (!contact) return res.status(400).json({ error: "Contact is required" });

    // Sanitize input to prevent NoSQL injection
    contact = sanitize(contact);

    const lead = await Lead.create({ contact });
    res.status(201).json({ message: "Lead saved successfully", lead });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save lead" });
  }
});

export default router;
