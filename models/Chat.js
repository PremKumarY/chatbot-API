import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    from: { type: String, required: true }, // "user" or "bot"
    text: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", ChatSchema);
