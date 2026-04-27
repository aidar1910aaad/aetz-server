import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAuditLogsTable1718000000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "audit_logs" (
                "id" SERIAL NOT NULL,
                "entityType" character varying NOT NULL,
                "entityId" character varying,
                "action" character varying NOT NULL,
                "fieldChanged" character varying,
                "oldValue" text,
                "newValue" text,
                "changedBy" character varying NOT NULL,
                "changedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_audit_logs" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "audit_logs"`);
    }
}
