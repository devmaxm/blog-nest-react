import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserEntity1704453855869 implements MigrationInterface {
  name = 'UserEntity1704453855869';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users_entity" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "refreshToken" character varying, CONSTRAINT "UQ_afcd3ae9dbf45eced5872ca49b0" UNIQUE ("email"), CONSTRAINT "PK_d9b0d3777428b67f460cf8a9b14" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users_entity"`);
  }
}
