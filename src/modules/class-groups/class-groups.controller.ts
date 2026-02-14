import { Request, Response } from "express";
import { classGroupService } from "./class-groups.service";

class ClassGroupController {

  create = async (req: Request, res: Response) => {
    const group = await classGroupService.create(req.body);
    res.status(201).json(group);
  };

  list = async (_req: Request, res: Response) => {
    const groups = await classGroupService.list();
    res.json(groups);
  };

  getById = async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const group = await classGroupService.getById(id);
    res.json(group);
  };

  update = async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const group = await classGroupService.update(id, req.body);
    res.json(group);
  };

  delete = async (req: Request, res: Response) => {
    const id = String(req.params.id);
    await classGroupService.delete(id);
    res.status(204).send();
  };
}

export const classGroupController = new ClassGroupController();
