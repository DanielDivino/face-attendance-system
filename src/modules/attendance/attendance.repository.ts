import { AppDataSource } from "../../shared/database/data-source";
import { Attendance } from "../../shared/database/entities/Attendance.entity";


export const attendanceRepository = AppDataSource.getRepository(Attendance);