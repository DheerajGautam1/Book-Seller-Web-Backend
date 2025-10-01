import { v2 as cloudinary } from 'cloudinary';
import { Book } from "../models/BookSchema.js";
import {catchAsyncErrors} from "../midleware/catchAsyncError.js";

//add a new book
export const addBook = catchAsyncErrors(async (req, res, next) => {
  // check for file
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      success: false,
      message: "No files were uploaded."
    });
  }

  const { image } = req.files;
  const { title, author, condition, Prize, description } = req.body;

  // validate fields
  if (!title || !author || !condition || !Prize || !description) {
    return res.status(400).json({
      success: false,
      message: "Please provide all fields."
    });
  }

  // upload to cloudinary
  const result = await cloudinary.uploader.upload(image.tempFilePath, {
    folder: "books",
  });

  // create new book
  const book = await Book.create({
    title,
    author,
    condition,
    Prize,
    description,
    image: {
       url: result.secure_url,
      public_id: result.public_id
  },
    user: req.user._id, // user id from auth middleware
  });

  res.status(201).json({
    success: true,
    message: "Book added successfully",
    book,
  });
});

//get all books
export const getAllBooks = catchAsyncErrors(async (req, res, next) => {
    const books = await Book.find()
    .populate("user", "email")
    .sort({ createdAt: -1 });
    
  res.status(200).json({
    success: true,
    count: books.length,
    books,
  });
});

// Get books of logged-in user only
export const getUserBooks = catchAsyncErrors(async (req, res, next) => {
  const books = await Book.find({ user: req.user._id })
    .populate("user", "email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: books.length,
    books,
  });
});

// delete a book
export const deleteBook = catchAsyncErrors(async (req, res, next) => {
    const book = await Book.findById(req.params.id);
    if (!book) {
        return res.status(404).json({
            success: false,
            message: "Book not found",   
        });
    }
    await book.remove();
    res.status(200).json({
        success: true,
        message: "Book deleted successfully",
    });
});

//update a book (only by owner)
export const updateBook = catchAsyncErrors(async (req, res, next) => {
  const bookId = req.params.id; // use id, not _id
  let book = await Book.findById(bookId);

   console.log("Book user:", book.user.toString());
  console.log("Logged in user:", req.user?._id.toString());
  
  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });
  }

  if (book.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to update this book",
    });
  }
 

  const { title, author, condition, Prize, description } = req.body;

  if (req.files && req.files.image) {
    if (book.image && book.image.public_id) {
      await cloudinary.uploader.destroy(book.image.public_id);
    }
    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
      folder: "books",
    });
    book.image = { url: result.secure_url, public_id: result.public_id };
  }

  if (title) book.title = title;
  if (author) book.author = author;
  if (condition) book.condition = condition;
  if (Prize) book.Prize = Prize;
  if (description) book.description = description;

  await book.save();

  res.status(200).json({
    success: true,
    message: "Book updated successfully",
    book,
  });
});
