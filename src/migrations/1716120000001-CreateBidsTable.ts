import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBidsTable1716120000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "bids" (
                "id" SERIAL NOT NULL,
                "bidNumber" character varying NOT NULL,
                "type" character varying NOT NULL,
                "date" character varying NOT NULL,
                "client" character varying NOT NULL,
                "taskNumber" character varying NOT NULL,
                "totalAmount" numeric(15,2),
                "data" jsonb NOT NULL,
                "user" jsonb NOT NULL,
                "userId" integer,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_bids_bidNumber" UNIQUE ("bidNumber"),
                CONSTRAINT "PK_bids" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "bids" 
            ADD CONSTRAINT "FK_bids_userId" 
            FOREIGN KEY ("userId") 
            REFERENCES "users"("id") 
            ON DELETE SET NULL ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bids" DROP CONSTRAINT "FK_bids_userId"`);
        await queryRunner.query(`DROP TABLE "bids"`);
    }
}