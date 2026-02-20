import { AppDataSource } from "../../shared/database/data-source";
import { FacialBiometric } from "../../shared/database/entities/FacialBiometric.entity";

export const biometricRepository = AppDataSource.getRepository(FacialBiometric);
