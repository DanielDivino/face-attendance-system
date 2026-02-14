import { Request, Response } from "express";
import { studentService } from "./student.service";

class StudentController {

  create = async (req: Request, res: Response) => {
    const student = await studentService.create(req.body);
    res.status(201).json(student);
  };

  list = async (_req: Request, res: Response) => {
    const students = await studentService.list();
    res.json(students);
  };

  getById = async (req: Request, res: Response) => {
    const student = await studentService.getById(req.params.id as string);
    res.json(student);
  };

  update = async (req: Request, res: Response) => {
    const student = await studentService.update(
      req.params.id as string,
      req.body
    );
    res.json(student);
  };

  delete = async (req: Request, res: Response) => {
    await studentService.delete(req.params.id as string);
    res.status(204).send();
  };
}

export const studentController = new StudentController();
