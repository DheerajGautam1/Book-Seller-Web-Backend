import express from 'express';
import { isAuthenticated } from "../midleware/authMiddleware.js";
import { addBook, deleteBook, getAllBooks, getUserBooks, updateBook } from '../controller/bookController.js';

const router = express.Router();

router.post("/add", isAuthenticated, addBook);
router.get("/books", getAllBooks);
router.get("/userbooks", isAuthenticated, getUserBooks);
router.delete("/delete/:id", isAuthenticated, deleteBook);
router.put("/update/:id", isAuthenticated, updateBook);

export default router;
