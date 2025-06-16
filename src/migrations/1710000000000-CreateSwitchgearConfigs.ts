import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSwitchgearConfigs1710000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE switchgear_configs (
        id SERIAL PRIMARY KEY,
        type VARCHAR NOT NULL,
        breaker VARCHAR NOT NULL,
        amperage INTEGER NOT NULL,
        "group" VARCHAR NOT NULL,
        busbar VARCHAR NOT NULL,
        cells JSONB NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE switchgear_configs;`);
  }
} 