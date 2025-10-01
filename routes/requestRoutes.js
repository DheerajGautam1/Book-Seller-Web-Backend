import express from "express";
import { getAllRequests, sendRequest } from "../controller/RequestController.js";
import { isAuthenticated } from "../midleware/authMiddleware.js";
const router = express.Router();

router.post("/requests", sendRequest);
router.get("/getAllRequests", isAuthenticated, getAllRequests);

export default router;
