import { Request, Response } from "express";
import { biometricsService } from "./biometrics.service";

class BiometricsController {
  create = async (req: Request, res: Response) => {
    const biometric = await biometricsService.create(req.body);
    res.status(201).json(biometric);
  };

  list = async (req: Request, res: Response) => {
    const alunoId = String(req.query.alunoId ?? "");
    if (!alunoId) {
      return res.status(400).json({ message: "alunoId é obrigatório" });
    }

    const list = await biometricsService.listByAluno(alunoId);
    res.json(list);
  };

  getById = async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const biometric = await biometricsService.getByIdOrThrow(id);
    res.json(biometric);
  };

  delete = async (req: Request, res: Response) => {
    const id = String(req.params.id);
    await biometricsService.delete(id);
    res.status(204).send();
  };
}

export const biometricsController = new BiometricsController();
