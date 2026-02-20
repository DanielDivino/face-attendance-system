import { FindOptionsWhere } from "typeorm";
import { lessonRepository } from "./lessons.repository";
import { AppError } from "../../shared/http/appErros";

import { CreateLessonDTO } from "./dtos/create-lesson.dto";
import { UpdateLessonDTO } from "./dtos/update-lesson.dto";

import { classGroupService } from "../class-groups/class-groups.service";
import { Lesson } from "../../shared/database/entities/Lesson.entity";

class LessonsService {
  private parseDate(dateStr: string) {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) {
      throw new AppError("Data inválida. Use formato ISO 8601.", 400);
    }
    return date;
  }

  async create(data: CreateLessonDTO) {
    const turmaId = String(data.turmaId);
    await classGroupService.getByIdOrThrow(turmaId);

    const lessonDate = this.parseDate(String(data.data));

    const lesson = lessonRepository.create({
      turmaId,
      data: lessonDate,
      conteudo: data.conteudo?.trim() || null,
    });

    return lessonRepository.save(lesson);
  }

  async listAll(){
    return lessonRepository.find({
      order: { data: "DESC" },
    });

  }

  async listByTurma(turmaId: string) {
    await classGroupService.getByIdOrThrow(turmaId);

    return lessonRepository.find({
      where: { turmaId } as FindOptionsWhere<Lesson>,
      order: { data: "DESC" },
    });
  }

  async getByIdOrThrow(id: string) {
    const where: FindOptionsWhere<Lesson> = { id };
    const lesson = await lessonRepository.findOne({ where });

    if (!lesson) throw new AppError("Aula não encontrada", 404);
    return lesson;
  }

  async getById(id: string) {
    return this.getByIdOrThrow(id);
  }

  async update(id: string, data: UpdateLessonDTO) {
    const lesson = await this.getByIdOrThrow(id);

    if (data.data !== undefined) {
      lesson.data = this.parseDate(String(data.data));
    }

    if (data.conteudo !== undefined) {
      lesson.conteudo = data.conteudo === null ? null : String(data.conteudo).trim();
    }

    return lessonRepository.save(lesson);
  }

  async delete(id: string) {
    const lesson = await this.getByIdOrThrow(id);
    await lessonRepository.remove(lesson);
  }
}

export const lessonsService = new LessonsService();
