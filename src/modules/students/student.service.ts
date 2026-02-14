import { studentRepository } from "./student.repository";
import { AppError } from "../../shared/http/appErros";
import { Student } from "../../shared/database/entities/Student.entity";
import { CreateStudentDTO } from "./dtos/create-student.dto";
import { UpdateStudentDTO } from "./dtos/update-student.dto";


class StudentService {

  async create(data: CreateStudentDTO) {
    const exists = await studentRepository.findOne({
      where: { matricula: data.matricula },
    });

    if (exists) {
      throw new AppError("Matrícula já cadastrada", 409);
    }

    const student = studentRepository.create(data);
    return studentRepository.save(student);
  }

  async list() {
    return studentRepository.find();
  }

  async getByIdOrThrow(id: string): Promise<Student> {
    const student = await studentRepository.findOne({
      where: { id },
    });

    if (!student) {
      throw new AppError("Aluno não encontrado", 404);
    }

    return student;
  }

  async getById(id: string) {
    return this.getByIdOrThrow(id);
  }

  async update(id: string, data: UpdateStudentDTO) {
    const student = await this.getByIdOrThrow(id);

    Object.assign(student, data);
    return studentRepository.save(student);
  }

  async delete(id: string) {
    const student = await this.getByIdOrThrow(id);
    await studentRepository.remove(student);
  }
}

export const studentService = new StudentService();
