// src/index.ts
import express from "express";
import { PrismaClient } from "@prisma/client";
import identifyRouter from "./routes/identify";

const app = express();
const prisma = new PrismaClient();
app.use(express.json());

app.use("/identify", identifyRouter);

app.get("/", (req, res) => {
    res.send("Bitespeed Identity Reconciliation API is running.");
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
