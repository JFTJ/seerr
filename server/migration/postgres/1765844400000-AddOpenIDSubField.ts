import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOpenIDSubField1765844400000 implements MigrationInterface {
  name = 'AddOpenIDSubField1765844400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "openidSub" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_openidSub" UNIQUE ("openidSub")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_openidSub"`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "openidSub"`);
  }
}
