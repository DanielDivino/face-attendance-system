import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { Student } from "../entities/Student.entity";

@Entity("facial_biometrics")
@Index(["alunoId"])
export class FacialBiometric {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  alunoId!: string;

  // Postgres: jsonb é ótimo pra array de números (embedding)
  @Column({ type: "jsonb" })
  descriptor!: number[];

  @Column({ type: "varchar", length: 60 })
  modeloVersao!: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @ManyToOne(() => Student, (student) => student.biometriaFacial, { onDelete: "CASCADE" })
  @JoinColumn({ name: "alunoId" })
  aluno!: Student;
}
