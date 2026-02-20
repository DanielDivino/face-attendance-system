import { Request, Response } from "express";
import { attendanceService } from "./attendance.service";

class AttendanceController {
  create = async (req: Request, res: Response) => {
    const att = await attendanceService.create(req.body);
    res.status(201).json(att);
  };

  // Opção B
  list = async (req: Request, res: Response) => {
    const aulaId = String(req.query.aulaId ?? "");
    if (!aulaId) {
      return res.status(400).json({ message: "aulaId é obrigatório" });
    }

    const result = await attendanceService.callListByAula(aulaId);
    res.json(result);
  };

  getById = async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const att = await attendanceService.getByIdOrThrow(id);
    res.json(att);
  };

  update = async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const att = await attendanceService.update(id, req.body);
    res.json(att);
  };

  delete = async (req: Request, res: Response) => {
    const id = String(req.params.id);
    await attendanceService.delete(id);
    res.status(204).send();
  };
}

export const attendanceController = new AttendanceController();
