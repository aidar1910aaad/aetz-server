import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVoltageTypeToCalculationGroup1710000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "calculation_group" 
      ADD COLUMN "voltageType" INTEGER NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "calculation_group" 
      DROP COLUMN "voltageType";
    `);
  }
} 