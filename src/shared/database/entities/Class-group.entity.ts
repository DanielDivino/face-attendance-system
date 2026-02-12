import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Index,
} from "typeorm";

import { Lesson } from "../entities/Lesson.entity";
import { Enrollment } from "../entities/Enrollment.entity";

@Entity("class_groups")

export class ClassGroup {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 120 })
  @Index()
  nome!: string;

  @Column({ type: "int" })
  @Index()
  anoLetivo!: number;

  @Column({ type: "varchar", length: 20 })
  turno!: string; // "manhã" | "tarde" | "noite" (pode virar enum depois)

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @OneToMany(() => Lesson, (lesson) => lesson.turma)
  aulas!: Lesson[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.turma)
  matriculas!: Enrollment[];
}
