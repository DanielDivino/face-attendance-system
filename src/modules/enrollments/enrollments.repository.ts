import { AppDataSource } from "../../shared/database/data-source";
import { Enrollment } from "../../shared/database/entities/Enrollment.entity";

export const enrollmentRepository =  AppDataSource.getRepository(Enrollment);
