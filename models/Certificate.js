import mongoose from "mongoose";

// 🔐 STRICT ID REGEX
const CERT_REGEX = /^C-0A\d{4}\d{2}S\d{4}$/;
const STUD_REGEX = /^St-0A\d{4}[A-Z0-9]{4}\d{4}$/;

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      uppercase: true,
      trim: true,
      immutable: true, // 🔒 cannot be changed after creation
      match: [CERT_REGEX, "Invalid Certificate ID format"],
    },

    studentId: {
      type: String,
      required: true,
      index: true,
      trim: true,
      match: [STUD_REGEX, "Invalid Student ID format"],
    },

    studentName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },

    courseName: {
      type: String,
      required: true,
      trim: true,
    },

    certificateType: {
      type: String,
      required: true,
      enum: [
        "Training",
        "Course",
        "Internship",
        "Internship Remote",
      ],
    },

    startDate: {
      type: Date,
      required: true,
    },

    completionDate: {
      type: Date,
      required: true,
    },

    issueDate: {
      type: Date,
      required: true,
    },

    certificateUrl: {
      type: String,
      trim: true,
      match: [
        /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/,
        "Invalid certificate URL",
      ],
    },

    status: {
      type: String,
      enum: ["Pending", "Active", "Issued", "Revoked"],
      default: "Pending",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* ------------------------------------------------------------------
   🔒 GLOBAL DATE SEQUENCE VALIDATION (CREATE + UPDATE SAFE)
------------------------------------------------------------------ */
certificateSchema.pre("validate", function (next) {
  const { startDate, completionDate, issueDate } = this;

  if (!startDate || !completionDate || !issueDate) {
    return next(new Error("All date fields are required"));
  }

  if (completionDate < startDate) {
    return next(
      new Error("Completion date must be on or after start date")
    );
  }

  if (issueDate < completionDate) {
    return next(
      new Error("Issue date must be on or after completion date")
    );
  }

  next();
});

// 🔥 FAST VERIFICATION INDEX
certificateSchema.index({ certificateId: 1, studentId: 1 });

export default mongoose.model("Certificate", certificateSchema);
