import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    contact: { type: String, required: true }, // email or phone
  },
  { timestamps: true }
);

export default mongoose.model("Lead", LeadSchema);
