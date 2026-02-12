import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

export const app = express();

app.use(express.json({ limit: "10mb" }));

app.get("/", (_req, res) => {
  res.json({ status: "ok" });
});
