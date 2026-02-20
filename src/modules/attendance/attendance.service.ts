import { FindOptionsWhere } from "typeorm";

import { attendanceRepository } from "./attendance.repository";
import { AppError } from "../../shared/http/appErros";

import { CreateAttendanceDTO } from "./dtos/create-attendance.dto";
import { UpdateAttendanceDTO } from "./dtos/recognize-attendance.dto";

import { lessonsService } from "../lessons/lessons.service";
import { classGroupService } from "../class-groups/class-groups.service";

import { AppDataSource } from "../../shared/database/data-source";
import { Attendance } from "../../shared/database/entities/Attendance.entity";
import { Enrollment } from "../../shared/database/entities/Enrollment.entity";

import { AttendanceStatus } from "../../shared/database/enums/EnrollmentStatus.enum";
import { AttendanceOrigin } from "../../shared/database/enums/EnrollmentStatus.enum";
import { EnrollmentStatus } from "../../shared/database/enums/EnrollmentStatus.enum";

class AttendanceService {
  private parseStatus(value?: UpdateAttendanceDTO["status"] | CreateAttendanceDTO["status"]) {
    if (!value) return undefined;
    switch (value) {
      case "presente":
        return AttendanceStatus.PRESENTE;
      case "falta":
        return AttendanceStatus.FALTA;
      case "atraso":
        return AttendanceStatus.ATRASO;
      case "justificado":
        return AttendanceStatus.JUSTIFICADO;
      default:
        throw new AppError("Status inválido", 400);
    }
  }

  private parseOrigem(value?: UpdateAttendanceDTO["origem"] | CreateAttendanceDTO["origem"]) {
    if (!value) return undefined;
    switch (value) {
      case "manual":
        return AttendanceOrigin.MANUAL;
      case "facial":
        return AttendanceOrigin.FACIAL;
      default:
        throw new AppError("Origem inválida", 400);
    }
  }

  private parseConfianca(value?: number | null) {
    if (value === undefined) return undefined;
    if (value === null) return null;
    const n = Number(value);
    if (Number.isNaN(n) || n < 0 || n > 1) {
      throw new AppError("confianca deve ser um número entre 0 e 1", 400);
    }
    return n;
  }

  async create(data: CreateAttendanceDTO) {
    const aulaId = String(data.aulaId);
    const alunoId = String(data.alunoId);

    // 1) aula existe?
    const aula = await lessonsService.getByIdOrThrow(aulaId);

    // 2) aluno está matriculado na turma dessa aula e ativo?
    const enrollmentRepo = AppDataSource.getRepository(Enrollment);
    const enrollment = await enrollmentRepo.findOne({
      where: {
        turmaId: aula.turmaId,
        alunoId,
        status: EnrollmentStatus.ATIVO,
      } as FindOptionsWhere<Enrollment>,
    });

    if (!enrollment) {
      throw new AppError("Aluno não está matriculado (ativo) na turma desta aula", 409);
    }

    // 3) evita duplicidade (aulaId + alunoId)
    const where: FindOptionsWhere<Attendance> = { aulaId, alunoId };
    const exists = await attendanceRepository.findOne({ where });
    if (exists) {
      throw new AppError("Presença já registrada para este aluno nesta aula", 409);
    }

    // 4) cria presença
    const attendance = attendanceRepository.create({
      aulaId,
      alunoId,
      status: this.parseStatus(data.status)!,
      origem: this.parseOrigem(data.origem) ?? AttendanceOrigin.MANUAL,
      confianca: this.parseConfianca(data.confianca) ?? null,
    });

    return attendanceRepository.save(attendance);
  }

  async getByIdOrThrow(id: string) {
    const where: FindOptionsWhere<Attendance> = { id };
    const att = await attendanceRepository.findOne({ where });
    if (!att) throw new AppError("Registro de presença não encontrado", 404);
    return att;
  }

  async update(id: string, data: UpdateAttendanceDTO) {
    const att = await this.getByIdOrThrow(id);

    if (data.status !== undefined) att.status = this.parseStatus(data.status)!;
    if (data.origem !== undefined) att.origem = this.parseOrigem(data.origem)!;
    if (data.confianca !== undefined) att.confianca = this.parseConfianca(data.confianca);

    return attendanceRepository.save(att);
  }

  async delete(id: string) {
    const att = await this.getByIdOrThrow(id);
    await attendanceRepository.remove(att);
  }

  
  async callListByAula(aulaId: string) {
    const aula = await lessonsService.getByIdOrThrow(aulaId);
    const turma = await classGroupService.getByIdOrThrow(aula.turmaId);

    // 1) pega alunos matriculados (ativos) da turma (com join no aluno)
    const enrollmentRepo = AppDataSource.getRepository(Enrollment);

    const enrollments = await enrollmentRepo
      .createQueryBuilder("e")
      .innerJoinAndSelect("e.aluno", "aluno")
      .select(["e.id", "e.status", "aluno.id", "aluno.nome", "aluno.matricula"])
      .where("e.turmaId = :turmaId", { turmaId: aula.turmaId })
      .andWhere("e.status = :status", { status: EnrollmentStatus.ATIVO })
      .getMany();

    const alunosBase = enrollments.map((e) => ({
      id: e.aluno.id,
      nome: e.aluno.nome,
      matricula: e.aluno.matricula,
    }));

    if (alunosBase.length === 0) {
      return {
        aula,
        turma,
        alunos: [],
      };
    }

    const alunoIds = alunosBase.map((a) => a.id);

    // 2) pega presenças já registradas para esta aula e esses alunos
    const atts = await attendanceRepository
       .createQueryBuilder("a")
       .where("a.aulaId = :aulaId", { aulaId })
       .andWhere("a.alunoId IN (:...ids)", { ids: alunoIds })
       .getMany();


    const attMap = new Map<string, Attendance>();
    for (const a of atts) attMap.set(a.alunoId, a);

    // 3) monta lista final (com presença ou pendente)
    const alunos = alunosBase.map((aluno) => {
      const a = attMap.get(aluno.id);
      return {
        ...aluno,
        presenca: a
          ? {
              id: a.id,
              status: a.status,
              origem: a.origem,
              confianca: a.confianca,
              createdAt: a.createdAt,
            }
          : null,
      };
    });

    return { aula, turma, alunos };
  }
}

export const attendanceService = new AttendanceService();
