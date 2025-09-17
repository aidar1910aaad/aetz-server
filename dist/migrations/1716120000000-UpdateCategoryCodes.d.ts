import { MigrationInterface, QueryRunner } from "typeorm";
export declare class UpdateCategoryCodes1716120000000 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
    private generateCode;
}
