import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMaterialCurrencyFields1717000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "material"
            ADD COLUMN "currency" character varying NOT NULL DEFAULT 'KZT',
            ADD COLUMN "priceInCurrency" numeric(12,2) NOT NULL DEFAULT 0,
            ADD COLUMN "rateAtCreation" numeric(12,6) NOT NULL DEFAULT 1,
            ADD COLUMN "priceKztAtCreation" numeric(12,2) NOT NULL DEFAULT 0
        `);

        await queryRunner.query(`
            UPDATE "material"
            SET
                "currency" = 'KZT',
                "priceInCurrency" = COALESCE("price", 0),
                "rateAtCreation" = 1,
                "priceKztAtCreation" = COALESCE("price", 0)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "material"
            DROP COLUMN "priceKztAtCreation",
            DROP COLUMN "rateAtCreation",
            DROP COLUMN "priceInCurrency",
            DROP COLUMN "currency"
        `);
    }
}
