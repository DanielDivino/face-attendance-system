import { Request, Response } from "express";
import { enrollmentsService } from "./enrollments.service";

class EnrollmentsController {
  create = async (req: Request, res: Response) => {
    const enrollment = await enrollmentsService.create(req.body);
    res.status(201).json(enrollment);
  };

  rosterByTurma = async (req: Request, res: Response) => {
    const turmaId = String(req.query.turmaId ?? "");
    if (!turmaId) {
      return res.status(400).json({ message: "turmaId é obrigatório" });
    }

    const includeInativos =
      String(req.query.includeInativos ?? "false").toLowerCase() === "true";

    const result = await enrollmentsService.rosterByTurma(turmaId, includeInativos);
    res.json(result);
  };

  update = async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const enrollment = await enrollmentsService.update(id, req.body);
    res.json(enrollment);
  };

  delete = async (req: Request, res: Response) => {
    const id = String(req.params.id);
    await enrollmentsService.delete(id);
    res.status(204).send();
  };
}

export const enrollmentsController = new EnrollmentsController();
