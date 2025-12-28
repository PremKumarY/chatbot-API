import express from "express";
import { superAdminAuth } from "../middleware/superAdminAuth.js";
import Certificate from "../models/Certificate.js";

const router = express.Router();

/* =========================================================
   CREATE CERTIFICATE
========================================================= */
router.post("/", superAdminAuth, async (req, res) => {
  try {
    const {
      certificateId,
      studentId,
      studentName,
      courseName,
      certificateType,
      startDate,
      completionDate,
      issueDate,
      certificateUrl,
      status,
    } = req.body;

    // 🔴 Basic required check
    if (
      !certificateId ||
      !studentId ||
      !studentName ||
      !courseName ||
      !startDate ||
      !completionDate ||
      !issueDate
    ) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    // 🔴 Prevent duplicate certificateId
    const exists = await Certificate.findOne({ certificateId });
    if (exists) {
      return res.status(409).json({
        message: "Certificate ID already exists",
      });
    }

    const certificate = new Certificate({
      certificateId,
      studentId,
      studentName,
      courseName,
      certificateType,
      startDate,
      completionDate,
      issueDate,
      certificateUrl,
      status,
    });

    const saved = await certificate.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({
      message: err.message || "Certificate creation failed",
    });
  }
});

/* =========================================================
   READ ALL CERTIFICATES
========================================================= */
router.get("/", superAdminAuth, async (_req, res) => {
  try {
    const certificates = await Certificate.find().sort({
      createdAt: -1,
    });
    res.status(200).json(certificates);
  } catch {
    res.status(500).json({
      message: "Failed to fetch certificates",
    });
  }
});

/* =========================================================
   UPDATE CERTIFICATE (BY _id)
========================================================= */
router.put("/:id", superAdminAuth, async (req, res) => {
  try {
    // 🔒 certificateId must NEVER change
    delete req.body.certificateId;

    const updated = await Certificate.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true, // 🔥 REQUIRED
      }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Certificate not found",
      });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({
      message: err.message || "Certificate update failed",
    });
  }
});

/* =========================================================
   DELETE CERTIFICATE
========================================================= */
router.delete("/:id", superAdminAuth, async (req, res) => {
  try {
    const deleted = await Certificate.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: "Certificate not found",
      });
    }

    res.status(200).json({
      message: "Certificate deleted successfully",
    });
  } catch {
    res.status(500).json({
      message: "Certificate deletion failed",
    });
  }
});


/* =========================================================
   PUBLIC CERTIFICATE VERIFICATION
   POST /api/certificate/verify
========================================================= */
router.post("/verify", async (req, res) => {
  try {
    const { certificateId, studentId } = req.body;

    if (!certificateId || !studentId) {
      return res.status(400).json({
        message: "Certificate ID and Student ID are required",
      });
    }

    const certificate = await Certificate.findOne({
      certificateId: certificateId.trim().toUpperCase(),
      studentId: studentId.trim(),
      status: { $ne: "Revoked" }, // ❌ revoked certificates invalid
    }).select("-_id -createdAt -updatedAt");

    if (!certificate) {
      return res.status(404).json({
        message: "Certificate not found or invalid",
      });
    }

    res.status(200).json({
      success: true,
      data: certificate,
    });
  } catch (err) {
    res.status(500).json({
      message: "Verification failed",
    });
  }
});

// MONTH-WISE ENROLLMENT STATS
router.get("/stats/monthly", superAdminAuth, async (req, res) => {
  try {
    const stats = await Certificate.aggregate([
      {
        $match: {
          issueDate: { $ne: null }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$issueDate" },
            month: { $month: "$issueDate" }
          },
          total: { $sum: 1 }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);

    const formatted = stats.map(s => ({
      year: s._id.year,
      month: s._id.month,
      total: s.total
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Failed to load monthly stats" });
  }
});


export default router;
