"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTransformerPrice1710123456789 = void 0;
class UpdateTransformerPrice1710123456789 {
    async up(queryRunner) {
        await queryRunner.query(`
      UPDATE transformer 
      SET price = 0 
      WHERE price IS NULL
    `);
        await queryRunner.query(`
      ALTER TABLE transformer 
      ALTER COLUMN price TYPE integer USING price::integer,
      ALTER COLUMN price SET NOT NULL
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE transformer 
      ALTER COLUMN price DROP NOT NULL,
      ALTER COLUMN price TYPE decimal(10,2)
    `);
    }
}
exports.UpdateTransformerPrice1710123456789 = UpdateTransformerPrice1710123456789;
//# sourceMappingURL=1710123456789-UpdateTransformerPrice.js.map