import { Router } from "express";
import { studentController } from "./student.controller";
import { asyncHandler } from "../../shared/http/async-handler";

export const studentRoutes = Router();

studentRoutes.post("/", asyncHandler(studentController.create));
studentRoutes.get("/", asyncHandler(studentController.list));
studentRoutes.get("/:id", asyncHandler(studentController.getById));
studentRoutes.patch("/:id", asyncHandler(studentController.update));
studentRoutes.delete("/:id", asyncHandler(studentController.delete));
