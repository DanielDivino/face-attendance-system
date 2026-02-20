import { Request, Response } from "express";
import { lessonsService } from "./lessons.service";

class LessonsController {
  create = async (req: Request, res: Response) => {
    const lesson = await lessonsService.create(req.body);
    res.status(201).json(lesson);
  };

  list = async (req: Request, res: Response) => {
    const turmaId = req.query.turmaId? String(req.query.turmaId) : null;
    
  if (!turmaId) {
    const lessons = await lessonsService.listAll();
    return res.json(lessons);
  }

  const lessons = await lessonsService.listByTurma(turmaId);
  return res.json(lessons);
};

  getById = async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const lesson = await lessonsService.getById(id);
    res.json(lesson);
  };

  update = async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const lesson = await lessonsService.update(id, req.body);
    res.json(lesson);
  };

  delete = async (req: Request, res: Response) => {
    const id = String(req.params.id);
    await lessonsService.delete(id);
    res.status(204).send();
  };
}

export const lessonsController = new LessonsController();
