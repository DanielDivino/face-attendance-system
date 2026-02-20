import { FindOptionsWhere } from "typeorm";

import { biometricRepository } from "./biometrics.repository";
import { AppError } from "../../shared/http/appErros";

import { CreateBiometricDTO } from "./dtos/create-biometric.dto";

import { studentService } from "../students/student.service";
import { FacialBiometric } from "../../shared/database/entities/FacialBiometric.entity";

class BiometricsService {

  async create(data: CreateBiometricDTO) {
    const alunoId = String(data.alunoId);
    const modeloVersao = String(data.modeloVersao ?? "").trim();

    if (!modeloVersao) throw new AppError("modeloVersao é obrigatório", 400);
    
    if (data.descriptor === undefined || data.descriptor === null) {
      throw new AppError("descriptor é obrigatório", 400);
    }

    await studentService.getByIdOrThrow(alunoId);
    
    const biometric = biometricRepository.create({
      alunoId,
      descriptor: data.descriptor,
      modeloVersao,
    });

    return biometricRepository.save(biometric);
  }

  async listByAluno(alunoId: string) {
    await studentService.getByIdOrThrow(alunoId);

    return biometricRepository.find({
      where: { alunoId } as FindOptionsWhere<FacialBiometric>,
      order: { createdAt: "DESC" },
    });
  }

  async getByIdOrThrow(id: string) {
    const where: FindOptionsWhere<FacialBiometric> = { id };
    const biometric = await biometricRepository.findOne({ where });

    if (!biometric) throw new AppError("Biometria não encontrada", 404);
    return biometric;
  }

  async delete(id: string) {
    const biometric = await this.getByIdOrThrow(id);
    await biometricRepository.remove(biometric);
  }
}

export const biometricsService = new BiometricsService();
