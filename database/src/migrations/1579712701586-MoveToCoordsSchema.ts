import {MigrationInterface, QueryRunner} from "typeorm";

export class MoveToCoordsSchema1579712701586 implements MigrationInterface {
    name = 'MoveToCoordsSchema1579712701586'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createSchema('coords', true);

        await queryRunner.query(`CREATE TABLE "coords"."coord" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "modified_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, "deleted_at" TIMESTAMP DEFAULT null, "title" character varying NOT NULL, "description" text NOT NULL, CONSTRAINT "PK_05d285fb669d6beec38e2885182" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "coords"."fingerprint" ("id" SERIAL NOT NULL, "hash" character varying NOT NULL, "time_offset" numeric(7,2) NOT NULL, "video_id" integer, CONSTRAINT "PK_992b58f5a113fe93fda708995ed" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "coords"."video_origin_enum" AS ENUM('youtube')`, undefined);
        await queryRunner.query(`CREATE TABLE "coords"."video" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "modified_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, "deleted_at" TIMESTAMP DEFAULT null, "origin" "coords"."video_origin_enum" NOT NULL DEFAULT 'youtube', "title" character varying NOT NULL, "duration" numeric(7,2) NOT NULL, "origin_id" character varying NOT NULL, CONSTRAINT "PK_2a7e18bfdcb1c4a1d0dbb3b459b" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "coords"."clip" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "modified_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, "deleted_at" TIMESTAMP DEFAULT null, "time_position" numeric(7,2) NOT NULL, "coord_id" integer, "video_id" integer, CONSTRAINT "PK_8ef2e13649f7833f477a1bc4b41" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "coords"."fingerprint" ADD CONSTRAINT "FK_0a8d379a3572d50c9dc20965a61" FOREIGN KEY ("video_id") REFERENCES "coords"."video"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "coords"."clip" ADD CONSTRAINT "FK_bf07b7a2bc5564b9458c3395c4d" FOREIGN KEY ("coord_id") REFERENCES "coords"."coord"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "coords"."clip" ADD CONSTRAINT "FK_756229bcd7869caf5b95faad7d1" FOREIGN KEY ("video_id") REFERENCES "coords"."video"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "coords"."clip" DROP CONSTRAINT "FK_756229bcd7869caf5b95faad7d1"`, undefined);
        await queryRunner.query(`ALTER TABLE "coords"."clip" DROP CONSTRAINT "FK_bf07b7a2bc5564b9458c3395c4d"`, undefined);
        await queryRunner.query(`ALTER TABLE "coords"."fingerprint" DROP CONSTRAINT "FK_0a8d379a3572d50c9dc20965a61"`, undefined);
        await queryRunner.query(`DROP TABLE "coords"."clip"`, undefined);
        await queryRunner.query(`DROP TABLE "coords"."video"`, undefined);
        await queryRunner.query(`DROP TYPE "coords"."video_origin_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "coords"."fingerprint"`, undefined);
        await queryRunner.query(`DROP TABLE "coords"."coord"`, undefined);

        await queryRunner.dropSchema('coords', true);
    }

}
