import { Request } from "../models/requestSchema.js";
import { Book } from "../models/BookSchema.js";
import { catchAsyncErrors } from "../midleware/catchAsyncError.js";

// Send a request for a book
export const sendRequest = catchAsyncErrors(async (req, res) => {
  const { message, book } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, message: "Message is required" });
  }

  const bookDoc = await Book.findById(book).populate("user");
  if (!bookDoc) {
    return res.status(404).json({ success: false, message: "Book not found" });
  }

  const newRequest = await Request.create({
    message,
    book,
    sender: req.user?._id || null,
    receiver: bookDoc.user._id,
  });

  res.status(201).json({ success: true, request: newRequest });
});

// Get all requests for logged-in user
export const getAllRequests = catchAsyncErrors(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Login required" });
  }

  const requests = await Request.find({ receiver: req.user._id })
    .sort({ createdAt: -1 })
    .populate("book")
    .populate("sender", "email");

  res.status(200).json({ success: true, requests });
});
