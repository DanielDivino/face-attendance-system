import { classGroupRepository } from "./class-groups.repository";
import { AppError } from "../../shared/http/appErros";
import { CreateClassGroupDTO } from "./dtos/create-class-group.dto";
import { UpdateClassGroupDTO } from "./dtos/update-class-group.dto";
import { ClassGroup } from "../../shared/database/entities/Class-group.entity";



class ClassGroupService {


  private normalize(value: string) {
     return value.trim();
}

  private async ensureUnique(data: { nome: string; anoLetivo: number; turno: string }, ignoreId?: string) {
     const nome = this.normalize(data.nome);
     const turno = this.normalize(data.turno);

     const existing = await classGroupRepository.findOne({
     where: { nome, anoLetivo: data.anoLetivo, turno },
  });

  if (existing && existing.id !== ignoreId) {
     throw new AppError("Turma já cadastrada para esse ano e turno", 409);
  }

   return { nome, turno };
}

  async create(data: CreateClassGroupDTO) {
  const normalized = await this.ensureUnique(data);

  const group = classGroupRepository.create({
    ...data,
    ...normalized,
  });

  return classGroupRepository.save(group);
}

  async list() {
    return classGroupRepository.find();
  }

  async getByIdOrThrow(id: string): Promise<ClassGroup> {
    const group = await classGroupRepository.findOne({ where: { id } });

    if (!group) {
      throw new AppError("Turma não encontrada", 404);
    }

    return group;
  }

  async getById(id: string) {
    return this.getByIdOrThrow(id);
  }

  async update(id: string, data: UpdateClassGroupDTO) {
    const group = await this.getByIdOrThrow(id);

    Object.assign(group, data);
    return classGroupRepository.save(group);
  }

  async delete(id: string) {
    const group = await this.getByIdOrThrow(id);
    await classGroupRepository.remove(group);
  }
}

export const classGroupService = new ClassGroupService();
