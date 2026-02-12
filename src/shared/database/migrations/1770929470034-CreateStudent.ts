import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStudent1770929470034 implements MigrationInterface {
    name = 'CreateStudent1770929470034'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."attendance_status_enum" AS ENUM('presente', 'falta', 'atraso', 'justificado')`);
        await queryRunner.query(`CREATE TYPE "public"."attendance_origem_enum" AS ENUM('facial', 'manual')`);
        await queryRunner.query(`CREATE TABLE "attendance" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "aulaId" uuid NOT NULL, "alunoId" uuid NOT NULL, "status" "public"."attendance_status_enum" NOT NULL, "confianca" double precision, "origem" "public"."attendance_origem_enum" NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_ee0ffe42c1f1a01e72b725c0cb2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ba2c258bd726e0099cbb021e35" ON "attendance" ("aulaId", "alunoId") `);
        await queryRunner.query(`CREATE TABLE "facial_biometrics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "alunoId" uuid NOT NULL, "descriptor" jsonb NOT NULL, "modeloVersao" character varying(60) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_d308e3c1fa29b0a522262d97dac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bb5b51a8eadea91cca0d48fda1" ON "facial_biometrics" ("alunoId") `);
        await queryRunner.query(`CREATE TABLE "students" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying(150) NOT NULL, "matricula" character varying(50) NOT NULL, "fotoUrl" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97ba537467b4cf99364bca03867" UNIQUE ("matricula"), CONSTRAINT "PK_7d7f07271ad4ce999880713f05e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97ba537467b4cf99364bca0386" ON "students" ("matricula") `);
        await queryRunner.query(`CREATE TYPE "public"."enrollments_status_enum" AS ENUM('ativo', 'inativo')`);
        await queryRunner.query(`CREATE TABLE "enrollments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "alunoId" uuid NOT NULL, "turmaId" uuid NOT NULL, "status" "public"."enrollments_status_enum" NOT NULL DEFAULT 'ativo', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_7c0f752f9fb68bf6ed7367ab00f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_499f5172ce780c506e21a5b100" ON "enrollments" ("alunoId", "turmaId") `);
        await queryRunner.query(`CREATE TABLE "class_groups" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying(120) NOT NULL, "anoLetivo" integer NOT NULL, "turno" character varying(20) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_6c171cc3a186782e6c2cff1446b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_14034a29d2636934454ca487b1" ON "class_groups" ("nome") `);
        await queryRunner.query(`CREATE INDEX "IDX_b7f09ebedd4eaacff98d249651" ON "class_groups" ("anoLetivo") `);
        await queryRunner.query(`CREATE TABLE "lessons" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "turmaId" uuid NOT NULL, "data" TIMESTAMP WITH TIME ZONE NOT NULL, "conteudo" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_9b9a8d455cac672d262d7275730" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1d6db26370ef5766a5d1bd792d" ON "lessons" ("turmaId", "data") `);
        await queryRunner.query(`ALTER TABLE "attendance" ADD CONSTRAINT "FK_7ced292dbc5cefcf4e1fecb5c09" FOREIGN KEY ("aulaId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attendance" ADD CONSTRAINT "FK_f9efa0dad727d92567ccc7392c3" FOREIGN KEY ("alunoId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "facial_biometrics" ADD CONSTRAINT "FK_bb5b51a8eadea91cca0d48fda1c" FOREIGN KEY ("alunoId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollments" ADD CONSTRAINT "FK_f0f257907e24ff5546cc4be6f43" FOREIGN KEY ("alunoId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollments" ADD CONSTRAINT "FK_bfad26836299068d208d3a3a3de" FOREIGN KEY ("turmaId") REFERENCES "class_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lessons" ADD CONSTRAINT "FK_98894cc46e92805368be18e3292" FOREIGN KEY ("turmaId") REFERENCES "class_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lessons" DROP CONSTRAINT "FK_98894cc46e92805368be18e3292"`);
        await queryRunner.query(`ALTER TABLE "enrollments" DROP CONSTRAINT "FK_bfad26836299068d208d3a3a3de"`);
        await queryRunner.query(`ALTER TABLE "enrollments" DROP CONSTRAINT "FK_f0f257907e24ff5546cc4be6f43"`);
        await queryRunner.query(`ALTER TABLE "facial_biometrics" DROP CONSTRAINT "FK_bb5b51a8eadea91cca0d48fda1c"`);
        await queryRunner.query(`ALTER TABLE "attendance" DROP CONSTRAINT "FK_f9efa0dad727d92567ccc7392c3"`);
        await queryRunner.query(`ALTER TABLE "attendance" DROP CONSTRAINT "FK_7ced292dbc5cefcf4e1fecb5c09"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1d6db26370ef5766a5d1bd792d"`);
        await queryRunner.query(`DROP TABLE "lessons"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b7f09ebedd4eaacff98d249651"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_14034a29d2636934454ca487b1"`);
        await queryRunner.query(`DROP TABLE "class_groups"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_499f5172ce780c506e21a5b100"`);
        await queryRunner.query(`DROP TABLE "enrollments"`);
        await queryRunner.query(`DROP TYPE "public"."enrollments_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97ba537467b4cf99364bca0386"`);
        await queryRunner.query(`DROP TABLE "students"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bb5b51a8eadea91cca0d48fda1"`);
        await queryRunner.query(`DROP TABLE "facial_biometrics"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ba2c258bd726e0099cbb021e35"`);
        await queryRunner.query(`DROP TABLE "attendance"`);
        await queryRunner.query(`DROP TYPE "public"."attendance_origem_enum"`);
        await queryRunner.query(`DROP TYPE "public"."attendance_status_enum"`);
    }

}
