import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterAuditLogsChangedAtToTimestamptz1718000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "audit_logs"
      ALTER COLUMN "changedAt" TYPE TIMESTAMPTZ
      USING "changedAt" AT TIME ZONE 'UTC'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "audit_logs"
      ALTER COLUMN "changedAt" TYPE TIMESTAMP
      USING "changedAt" AT TIME ZONE 'UTC'
    `);
  }
}
