import { AppDataSource } from "../../shared/database/data-source";
import { Student } from "../../shared/database/entities/Student.entity";

export const studentRepository =
  AppDataSource.getRepository(Student);
