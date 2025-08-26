
// export default mongoose.model("Chat", ChatSchema);
import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    phone: { type: String }, // optional
    email: { 
      type: String, 
      required: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"] // ✅ email validation
    },
    from: { 
      type: String, 
      required: true, 
      enum: ["user", "bot"] // ✅ restrict to valid values
    },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", ChatSchema);
