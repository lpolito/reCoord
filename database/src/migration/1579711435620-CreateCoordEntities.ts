import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateCoordEntities1579711435620 implements MigrationInterface {
    name = 'CreateCoordEntities1579711435620'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "coord" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "modified_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, "deleted_at" TIMESTAMP DEFAULT null, "title" character varying NOT NULL, "description" text NOT NULL, CONSTRAINT "PK_a98634073be368915fea7ab8fe3" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "fingerprint" ("id" SERIAL NOT NULL, "hash" character varying NOT NULL, "time_offset" numeric(7,2) NOT NULL, "videoId" integer, CONSTRAINT "PK_8f1c3d8326a0907d1c7a5961f32" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "video_origin_enum" AS ENUM('youtube')`, undefined);
        await queryRunner.query(`CREATE TABLE "video" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "modified_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, "deleted_at" TIMESTAMP DEFAULT null, "origin" "video_origin_enum" NOT NULL DEFAULT 'youtube', "title" character varying NOT NULL, "duration" numeric(7,2) NOT NULL, "origin_id" character varying NOT NULL, CONSTRAINT "PK_1a2f3856250765d72e7e1636c8e" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "clip" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "modified_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, "deleted_at" TIMESTAMP DEFAULT null, "time_position" numeric(7,2) NOT NULL, "coordId" integer, "videoId" integer, CONSTRAINT "PK_f0685dac8d4dd056d7255670b75" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "fingerprint" ADD CONSTRAINT "FK_cabac819ece26f00b41a112ae6d" FOREIGN KEY ("videoId") REFERENCES "video"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "clip" ADD CONSTRAINT "FK_2e462ed2785826abf1d4310b20a" FOREIGN KEY ("coordId") REFERENCES "coord"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "clip" ADD CONSTRAINT "FK_60066a17021fc73ab6222a7db2a" FOREIGN KEY ("videoId") REFERENCES "video"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "clip" DROP CONSTRAINT "FK_60066a17021fc73ab6222a7db2a"`, undefined);
        await queryRunner.query(`ALTER TABLE "clip" DROP CONSTRAINT "FK_2e462ed2785826abf1d4310b20a"`, undefined);
        await queryRunner.query(`ALTER TABLE "fingerprint" DROP CONSTRAINT "FK_cabac819ece26f00b41a112ae6d"`, undefined);
        await queryRunner.query(`DROP TABLE "clip"`, undefined);
        await queryRunner.query(`DROP TABLE "video"`, undefined);
        await queryRunner.query(`DROP TYPE "video_origin_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "fingerprint"`, undefined);
        await queryRunner.query(`DROP TABLE "coord"`, undefined);
    }

}
