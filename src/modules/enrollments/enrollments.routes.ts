import { Router } from "express";
import { asyncHandler } from "../../shared/http/async-handler";
import { enrollmentsController } from "./enrollments.controller";

export const enrollmentsRoutes = Router();

enrollmentsRoutes.post("/", asyncHandler(enrollmentsController.create));

// Opção 4 (turma + alunos): GET /enrollments?turmaId=...
enrollmentsRoutes.get("/", asyncHandler(enrollmentsController.rosterByTurma));

enrollmentsRoutes.patch("/:id", asyncHandler(enrollmentsController.update));
enrollmentsRoutes.delete("/:id", asyncHandler(enrollmentsController.delete));
