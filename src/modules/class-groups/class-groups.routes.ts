import { Router } from "express";
import { classGroupController } from "./class-groups.controller";
import { asyncHandler } from "../../shared/http/async-handler";

export const classGroupRoutes = Router();

classGroupRoutes.post("/", asyncHandler(classGroupController.create));
classGroupRoutes.get("/", asyncHandler(classGroupController.list));
classGroupRoutes.get("/:id", asyncHandler(classGroupController.getById));
classGroupRoutes.patch("/:id", asyncHandler(classGroupController.update));
classGroupRoutes.delete("/:id", asyncHandler(classGroupController.delete));
