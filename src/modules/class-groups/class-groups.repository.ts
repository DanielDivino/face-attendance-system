import { AppDataSource } from "../../shared/database/data-source";
import { ClassGroup } from "../../shared/database/entities/Class-group.entity";

export const classGroupRepository =
  AppDataSource.getRepository(ClassGroup);
