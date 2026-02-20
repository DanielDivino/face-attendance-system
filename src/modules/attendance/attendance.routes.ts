import { Router } from "express";
import { asyncHandler } from "../../shared/http/async-handler";
import { attendanceController } from "./attendance.controller";

export const attendanceRoutes = Router();

attendanceRoutes.post("/", asyncHandler(attendanceController.create));
attendanceRoutes.get("/", asyncHandler(attendanceController.list)); //?aulaId=
attendanceRoutes.get("/:id", asyncHandler(attendanceController.getById));
attendanceRoutes.patch("/:id", asyncHandler(attendanceController.update));
attendanceRoutes.delete("/:id", asyncHandler(attendanceController.delete));
