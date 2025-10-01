import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  condition: {
    type: String,
    enum: ["new", "good", "old", "damaged"], 
    required: true
  },
  Prize: {
    type: Number,
    required: true,
    default: 0,
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true 
  }
}, { timestamps: true });

export const Book = mongoose.model("Book", bookSchema);
