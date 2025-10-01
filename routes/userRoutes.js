import express from "express";
import { isAuthenticated } from "../midleware/authMiddleware.js";
import { getMyProfile, loginUser, logoutUser, registerUser } from "../controller/userController.js";

const router = express.Router();

//Protected Route
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", isAuthenticated, logoutUser);
router.get("/me", isAuthenticated, getMyProfile);

export default router;