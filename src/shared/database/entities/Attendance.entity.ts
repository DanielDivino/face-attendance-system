import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { Lesson } from "../entities/Lesson.entity";
import { Student } from "../entities/Student.entity";
import { AttendanceOrigin, AttendanceStatus } from "../enums/EnrollmentStatus.enum";

@Entity("attendance")
@Index(["aulaId", "alunoId"], { unique: true }) // 1 presença por aluno por aula
export class Attendance {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  aulaId!: string;

  @Column({ type: "uuid" })
  alunoId!: string;

  @Column({ type: "enum", enum: AttendanceStatus })
  status!: AttendanceStatus;

  // 0–1 (ou você muda pra 0–100)
  @Column({ type: "float", nullable: true })
  confianca?: number | null;

  @Column({ type: "enum", enum: AttendanceOrigin })
  origem!: AttendanceOrigin;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @ManyToOne(() => Lesson, (lesson) => lesson.presencas, { onDelete: "CASCADE" })
  @JoinColumn({ name: "aulaId" })
  aula!: Lesson;

  @ManyToOne(() => Student, (student) => student.presencas, { onDelete: "CASCADE" })
  @JoinColumn({ name: "alunoId" })
  aluno!: Student;
}
