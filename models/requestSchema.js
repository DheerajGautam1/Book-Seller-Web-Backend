import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Request = mongoose.model("Request", requestSchema);
