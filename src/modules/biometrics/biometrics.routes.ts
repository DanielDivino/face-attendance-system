import { Router } from "express";
import { asyncHandler } from "../../shared/http/async-handler";
import { biometricsController } from "./biometrics.controller";

export const biometricsRoutes = Router();

biometricsRoutes.post("/", asyncHandler(biometricsController.create));
biometricsRoutes.get("/", asyncHandler(biometricsController.list)); // ?alunoId=
biometricsRoutes.get("/:id", asyncHandler(biometricsController.getById));
biometricsRoutes.delete("/:id", asyncHandler(biometricsController.delete));
