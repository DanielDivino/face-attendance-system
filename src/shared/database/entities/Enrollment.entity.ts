import {  Entity,  PrimaryGeneratedColumn,  Column,  CreateDateColumn,
ManyToOne,  JoinColumn,  Index,} from "typeorm";
import { EnrollmentStatus } from "../enums/EnrollmentStatus.enum";
import { Student } from "../entities/Student.entity";
import { ClassGroup } from "../entities/Class-group.entity";


@Entity("enrollments")
@Index(["alunoId", "turmaId"], { unique: true }) // evita duplicar matrícula do mesmo aluno na mesma turma

export class Enrollment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  alunoId!: string;

  @Column({ type: "uuid" })
  turmaId!: string;

  @Column({ type: "enum", enum: EnrollmentStatus, default: EnrollmentStatus.ATIVO })
  status!: EnrollmentStatus;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @ManyToOne(() => Student, (student) => student.matriculas, { onDelete: "CASCADE" })
  @JoinColumn({ name: "alunoId" })
  aluno!: Student;

  @ManyToOne(() => ClassGroup, (turma) => turma.matriculas, { onDelete: "CASCADE" })
  @JoinColumn({ name: "turmaId" })
  turma!: ClassGroup;
}
