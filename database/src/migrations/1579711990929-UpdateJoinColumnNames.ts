import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateJoinColumnNames1579711990929 implements MigrationInterface {
    name = 'UpdateJoinColumnNames1579711990929'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "fingerprint" DROP CONSTRAINT "FK_cabac819ece26f00b41a112ae6d"`, undefined);
        await queryRunner.query(`ALTER TABLE "clip" DROP CONSTRAINT "FK_2e462ed2785826abf1d4310b20a"`, undefined);
        await queryRunner.query(`ALTER TABLE "clip" DROP CONSTRAINT "FK_60066a17021fc73ab6222a7db2a"`, undefined);
        await queryRunner.query(`ALTER TABLE "fingerprint" RENAME COLUMN "videoId" TO "video_id"`, undefined);
        await queryRunner.query(`ALTER TABLE "clip" DROP COLUMN "coordId"`, undefined);
        await queryRunner.query(`ALTER TABLE "clip" DROP COLUMN "videoId"`, undefined);
        await queryRunner.query(`ALTER TABLE "clip" ADD "coord_id" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "clip" ADD "video_id" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "coord" ALTER COLUMN "deleted_at" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "video" ALTER COLUMN "deleted_at" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "clip" ALTER COLUMN "deleted_at" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "fingerprint" ADD CONSTRAINT "FK_806d5426856ce99149edf98dd16" FOREIGN KEY ("video_id") REFERENCES "video"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "clip" ADD CONSTRAINT "FK_af659ccf877cc1eb983b8ad973b" FOREIGN KEY ("coord_id") REFERENCES "coord"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "clip" ADD CONSTRAINT "FK_a3a110b288801644e884629a9d4" FOREIGN KEY ("video_id") REFERENCES "video"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "clip" DROP CONSTRAINT "FK_a3a110b288801644e884629a9d4"`, undefined);
        await queryRunner.query(`ALTER TABLE "clip" DROP CONSTRAINT "FK_af659ccf877cc1eb983b8ad973b"`, undefined);
        await queryRunner.query(`ALTER TABLE "fingerprint" DROP CONSTRAINT "FK_806d5426856ce99149edf98dd16"`, undefined);
        await queryRunner.query(`ALTER TABLE "clip" ALTER COLUMN "deleted_at" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "video" ALTER COLUMN "deleted_at" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "coord" ALTER COLUMN "deleted_at" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "clip" DROP COLUMN "video_id"`, undefined);
        await queryRunner.query(`ALTER TABLE "clip" DROP COLUMN "coord_id"`, undefined);
        await queryRunner.query(`ALTER TABLE "clip" ADD "videoId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "clip" ADD "coordId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "fingerprint" RENAME COLUMN "video_id" TO "videoId"`, undefined);
        await queryRunner.query(`ALTER TABLE "clip" ADD CONSTRAINT "FK_60066a17021fc73ab6222a7db2a" FOREIGN KEY ("videoId") REFERENCES "video"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "clip" ADD CONSTRAINT "FK_2e462ed2785826abf1d4310b20a" FOREIGN KEY ("coordId") REFERENCES "coord"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "fingerprint" ADD CONSTRAINT "FK_cabac819ece26f00b41a112ae6d" FOREIGN KEY ("videoId") REFERENCES "video"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

}
