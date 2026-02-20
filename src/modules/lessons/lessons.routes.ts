import { Router } from "express";
import { asyncHandler } from "../../shared/http/async-handler";
import { lessonsController } from "./lessons.controller";

export const lessonsRoutes = Router();

lessonsRoutes.post("/", asyncHandler(lessonsController.create));
lessonsRoutes.get("/", asyncHandler(lessonsController.list));
lessonsRoutes.get("/:id", asyncHandler(lessonsController.getById));
lessonsRoutes.patch("/:id", asyncHandler(lessonsController.update));
lessonsRoutes.delete("/:id", asyncHandler(lessonsController.delete));
