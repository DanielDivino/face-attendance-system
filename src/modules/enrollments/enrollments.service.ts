import { FindOptionsWhere } from "typeorm";

import { enrollmentRepository } from "./enrollments.repository";
import { AppError } from "../../shared/http/appErros";

import { CreateEnrollmentDTO } from "./dtos/create-enrollment.dto";
import { UpdateEnrollmentDTO } from "./dtos/update-enrollment.dto";

import { studentService } from "../students/student.service";
import { classGroupService } from "../class-groups/class-groups.service";

import { AppDataSource } from "../../shared/database/data-source";
import { FacialBiometric } from "../../shared/database/entities/Facial-biometric.entity";
import { Enrollment } from "../../shared/database/entities/Enrollment.entity";

import { EnrollmentStatus } from "../../shared/database/enums/EnrollmentStatus.enum"; // ajuste o caminho se necessário

class EnrollmentsService {
  private parseStatus(status?: "ativo" | "inativo"): EnrollmentStatus {
    if (!status) return EnrollmentStatus.ATIVO;
    return status === "ativo" ? EnrollmentStatus.ATIVO : EnrollmentStatus.INATIVO;
  }

  async create(data: CreateEnrollmentDTO) {
    const alunoId = String(data.alunoId);
    const turmaId = String(data.turmaId);

    await studentService.getByIdOrThrow(alunoId);
    await classGroupService.getByIdOrThrow(turmaId);

    const where: FindOptionsWhere<Enrollment> = { alunoId, turmaId };
    const exists = await enrollmentRepository.findOne({ where });

    if (exists) {
      throw new AppError("Aluno já está matriculado nesta turma", 409);
    }

    const enrollment = enrollmentRepository.create({
      alunoId,
      turmaId,
      status: this.parseStatus(data.status),
    });

    return enrollmentRepository.save(enrollment);
  }



  async getByIdOrThrow(id: string) {
    const where: FindOptionsWhere<Enrollment> = { id };
    const enrollment = await enrollmentRepository.findOne({ where });

    if (!enrollment) throw new AppError("Matrícula não encontrada", 404);
    return enrollment;
  }

  async update(id: string, data: UpdateEnrollmentDTO) {
    const enrollment = await this.getByIdOrThrow(id);

    enrollment.status = this.parseStatus(data.status);
    return enrollmentRepository.save(enrollment);
  }

  async delete(id: string) {
    const enrollment = await this.getByIdOrThrow(id);
    await enrollmentRepository.remove(enrollment);
  }

  async rosterByTurma(turmaId: string, includeInativos = false) {
    const turma = await classGroupService.getByIdOrThrow(turmaId);

    const qb = enrollmentRepository
      .createQueryBuilder("e")
      .innerJoinAndSelect("e.aluno", "aluno")
      .select(["e.id", "e.status", "aluno.id", "aluno.nome", "aluno.matricula"])
      .where("e.turmaId = :turmaId", { turmaId });

    if (!includeInativos) {
      qb.andWhere("e.status = :status", { status: EnrollmentStatus.ATIVO });
    }

    const enrollments = await qb.getMany();

    const alunosBase = enrollments.map((e) => ({
      enrollmentId: e.id,   
      id: e.aluno.id,
      nome: e.aluno.nome,
      matricula: e.aluno.matricula,
    }));

    if (alunosBase.length === 0) {
      return { turma, alunos: [] as any[] };
    }

    const alunoIds = alunosBase.map((a) => a.id);

    const bioRows = await AppDataSource.getRepository(FacialBiometric)
      .createQueryBuilder("b")
      .select("b.alunoId", "alunoId")
      .addSelect("COUNT(*)", "count")
      .where("b.alunoId IN (:...ids)", { ids: alunoIds })
      .groupBy("b.alunoId")
      .getRawMany<{ alunoId: string; count: string }>();

    const bioMap = new Map<string, number>();
    for (const row of bioRows) bioMap.set(row.alunoId, Number(row.count));

    const alunos = alunosBase.map((a) => {
      const qtd = bioMap.get(a.id) ?? 0;
      return { ...a, temBiometria: qtd > 0, qtdBiometrias: qtd };
    });

    return { turma, alunos };
  }
}

export const enrollmentsService = new EnrollmentsService();
