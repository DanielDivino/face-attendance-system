import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import { studentRoutes } from "./modules/students/student.routes";
import { classGroupRoutes } from "./modules/class-groups/class-groups.routes";
import { errorHandler } from "./shared/http/error-handler";

dotenv.config();

export const app = express();

app.use(express.json({ limit: "10mb" }));

app.get("/", (_req, res) => {
  res.json({ status: "ok" });
});

// Rotas
app.use("/students", studentRoutes);
app.use("/class-groups", classGroupRoutes);


// Middleware de erro (sempre por último)
app.use(errorHandler);
