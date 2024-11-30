import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1732967615706 implements MigrationInterface {
  name = 'InitialMigration1732967615706';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "goals" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "intervalId" integer NOT NULL, CONSTRAINT "PK_26e17b251afab35580dff769223" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "intervals" ("id" SERIAL NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_7e4b9f86ec6cdbdbf21c19f79b5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying, "lastName" character varying, "role" character varying NOT NULL DEFAULT 'user', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "goals" ADD CONSTRAINT "FK_63af97c5d924d968d82417f894b" FOREIGN KEY ("intervalId") REFERENCES "intervals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "intervals" ADD CONSTRAINT "FK_0684b09d6f96e9368f4336b3d76" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "intervals" DROP CONSTRAINT "FK_0684b09d6f96e9368f4336b3d76"`,
    );
    await queryRunner.query(
      `ALTER TABLE "goals" DROP CONSTRAINT "FK_63af97c5d924d968d82417f894b"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "intervals"`);
    await queryRunner.query(`DROP TABLE "goals"`);
  }
}
