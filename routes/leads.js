import express from "express";
import Lead from "../models/Lead.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { contact } = req.body;
    if (!contact) return res.status(400).json({ error: "Contact is required" });

    const lead = await Lead.create({ contact });
    res.status(201).json({ message: "Lead saved successfully", lead });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save lead" });
  }
});

export default router;
