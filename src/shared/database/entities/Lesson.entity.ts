import {  Entity,  PrimaryGeneratedColumn,  Column,  CreateDateColumn,
  ManyToOne,  OneToMany,  JoinColumn,  Index,} from "typeorm";
import { ClassGroup } from "../entities/Class-group.entity";
import { Attendance } from "../entities/Attendance.entity";


@Entity("lessons")

@Index(["turmaId", "data"]) // ajuda a buscar aulas da turma por data
export class Lesson {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  turmaId!: string;

  @Column({ type: "timestamptz" })
  data!: Date;

  @Column({ type: "varchar", nullable: true })
  conteudo?: string | null;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @ManyToOne(() => ClassGroup, (turma) => turma.aulas, { onDelete: "CASCADE" })
  @JoinColumn({ name: "turmaId" })
  turma!: ClassGroup;

  @OneToMany(() => Attendance, (attendance) => attendance.aula)
  presencas!: Attendance[];
}
