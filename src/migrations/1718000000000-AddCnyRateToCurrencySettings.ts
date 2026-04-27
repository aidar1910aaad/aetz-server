import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCnyRateToCurrencySettings1718000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "currency_settings"
            ADD COLUMN "cnyRate" numeric(10,2) NOT NULL DEFAULT 62.3
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "currency_settings"
            DROP COLUMN "cnyRate"
        `);
    }
}
