// src/routes/identify.ts
import express from "express";
// Use the imported Request and Response types directly
import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { reconcileIdentity } from "../utils/contactHelper";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", async (req: Request, res: Response) => { // Using imported Request, Response
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    // Don't return the result of res.status().json()
    res.status(400).json({ error: "email or phoneNumber required" });
    // Use a plain return to exit if necessary
    return;
  }

  try {
    const contactResponse = await reconcileIdentity({ email, phoneNumber }, prisma);
    // Don't return the result of res.status().json()
    res.status(200).json({ contact: contactResponse });
  } catch (error) {
    console.error("Error in /identify route:", error);
    // Don't return the result of res.status().json()
    res.status(500).json({ error: "Internal Server Error" });
    // If an error occurs, the function will end here, and the promise implicitly resolves to void.
  }
  // If the try block completes successfully, the function implicitly ends,
  // and the promise resolves to void.
});

export default router;