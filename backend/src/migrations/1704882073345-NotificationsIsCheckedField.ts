import { MigrationInterface, QueryRunner } from 'typeorm';

export class NotificationsIsCheckedField1704882073345
  implements MigrationInterface
{
  name = 'NotificationsIsCheckedField1704882073345';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "isChecked" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP COLUMN "isChecked"`,
    );
  }
}
