import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const router = express.Router();

const MAX_ATTEMPTS = 2;
const LOCK_TIME = 30 * 60 * 1000; // 30 minutes

/* ======================================================
   CREATE SUPER ADMIN (ONE-TIME USE)
====================================================== */
router.post("/create-super-admin", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists = await Admin.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "SUPER_ADMIN"
    });

    res.status(201).json({ message: "Super Admin created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   LOGIN WITH LOCKOUT PROTECTION
====================================================== */
router.post("/login", async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase();
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    /* ---------- AUTO UNLOCK IF TIME PASSED ---------- */
    if (admin.lockUntil && admin.lockUntil <= Date.now()) {
      admin.lockUntil = null;
      admin.loginAttempts = 0;
      await admin.save();
    }

    /* ---------- ACCOUNT LOCK CHECK ---------- */
    if (admin.lockUntil && admin.lockUntil > Date.now()) {
      const remaining = Math.ceil(
        (admin.lockUntil - Date.now()) / 1000
      );

      return res.status(423).json({
        message: "Account locked due to multiple failed attempts",
        remaining
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    /* ---------- WRONG PASSWORD ---------- */
    if (!isMatch) {
      admin.loginAttempts += 1;

      if (admin.loginAttempts >= MAX_ATTEMPTS) {
        admin.lockUntil = new Date(Date.now() + LOCK_TIME);
      }

      await admin.save();

      return res.status(401).json({
        message: "Wrong password",
        attemptsLeft: Math.max(
          0,
          MAX_ATTEMPTS - admin.loginAttempts
        )
      });
    }

    /* ---------- SUCCESS LOGIN ---------- */
    admin.loginAttempts = 0;
    admin.lockUntil = null;
    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
        issuer: "IJKERTech-Admin"
      }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
