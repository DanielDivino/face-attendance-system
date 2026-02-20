import { AppDataSource } from "../../shared/database/data-source";
import { Lesson } from "../../shared/database/entities/Lesson.entity";

export const lessonRepository = AppDataSource.getRepository(Lesson);
