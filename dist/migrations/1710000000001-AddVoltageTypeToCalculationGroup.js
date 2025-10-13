"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddVoltageTypeToCalculationGroup1710000000001 = void 0;
class AddVoltageTypeToCalculationGroup1710000000001 {
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "calculation_group" 
      ADD COLUMN "voltageType" INTEGER NULL;
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "calculation_group" 
      DROP COLUMN "voltageType";
    `);
    }
}
exports.AddVoltageTypeToCalculationGroup1710000000001 = AddVoltageTypeToCalculationGroup1710000000001;
//# sourceMappingURL=1710000000001-AddVoltageTypeToCalculationGroup.js.map