import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Index,
} from "typeorm";
import { Attendance } from "./Attendance.entity";
import { Enrollment } from "./Enrollment.entity";
import { FacialBiometric } from "./Facial-biometric.entity";

@Entity("students")
export class Student {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 150 })
  nome!: string;

  @Column({ type: "varchar", length: 50, unique: true })
  @Index({ unique: true })
  matricula!: string;

  @Column({ type: "varchar", nullable: true })
  fotoUrl?: string | null;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  /*
  ==========================
  RELACIONAMENTOS
  ==========================
  */

  // Aluno 1:N Matrículas
  @OneToMany(() => Enrollment, (enrollment) => enrollment.aluno)
  matriculas!: Enrollment[];

  // Aluno 1:N Biometrias
  @OneToMany(() => FacialBiometric, (bio) => bio.aluno)
  biometriaFacial!: FacialBiometric[];

  // Aluno 1:N Presenças
  @OneToMany(() => Attendance, (attendance) => attendance.aluno)
  presencas!: Attendance[];
}

