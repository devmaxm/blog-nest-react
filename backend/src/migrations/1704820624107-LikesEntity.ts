import { MigrationInterface, QueryRunner } from 'typeorm';

export class LikesEntity1704820624107 implements MigrationInterface {
  name = 'LikesEntity1704820624107';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "likes_entity" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "postId" integer, "commentId" integer, CONSTRAINT "PK_60a8f0c05ea32c0760090e25eec" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "likes_entity" ADD CONSTRAINT "FK_218e78538d0a541b58970223058" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "likes_entity" ADD CONSTRAINT "FK_f5106d9a3417b3a72e8d98926a1" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "likes_entity" DROP CONSTRAINT "FK_f5106d9a3417b3a72e8d98926a1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "likes_entity" DROP CONSTRAINT "FK_218e78538d0a541b58970223058"`,
    );
    await queryRunner.query(`DROP TABLE "likes_entity"`);
  }
}
