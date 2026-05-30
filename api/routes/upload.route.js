import express from "express";
import { getUploadSignature } from "../controllers/upload.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Only logged-in users can request an upload signature.
router.get("/signature", verifyToken, getUploadSignature);

export default router;
