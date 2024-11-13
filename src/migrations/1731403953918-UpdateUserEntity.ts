import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserEntity1731403953918 implements MigrationInterface {
  name = 'UpdateUserEntity1731403953918';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "goals" DROP CONSTRAINT "FK_63af97c5d924d968d82417f894b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "intervals" DROP CONSTRAINT "FK_0684b09d6f96e9368f4336b3d76"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "password" character varying NOT NULL DEFAULT 'temporaryPassword'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "role" character varying NOT NULL DEFAULT 'user'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`,
    );
    await queryRunner.query(
      `ALTER TABLE "goals" ADD CONSTRAINT "FK_63af97c5d924d968d82417f894b" FOREIGN KEY ("intervalId") REFERENCES "intervals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "intervals" ADD CONSTRAINT "FK_0684b09d6f96e9368f4336b3d76" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "password" DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "intervals" DROP CONSTRAINT "FK_0684b09d6f96e9368f4336b3d76"`,
    );
    await queryRunner.query(
      `ALTER TABLE "goals" DROP CONSTRAINT "FK_63af97c5d924d968d82417f894b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
    await queryRunner.query(
      `ALTER TABLE "intervals" ADD CONSTRAINT "FK_0684b09d6f96e9368f4336b3d76" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "goals" ADD CONSTRAINT "FK_63af97c5d924d968d82417f894b" FOREIGN KEY ("intervalId") REFERENCES "intervals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
