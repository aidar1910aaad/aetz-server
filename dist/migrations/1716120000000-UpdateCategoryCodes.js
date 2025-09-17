"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCategoryCodes1716120000000 = void 0;
class UpdateCategoryCodes1716120000000 {
    async up(queryRunner) {
        const categories = await queryRunner.query(`SELECT id, name FROM category`);
        for (const category of categories) {
            const code = this.generateCode(category.name);
            await queryRunner.query(`UPDATE category SET code = $1 WHERE id = $2`, [code, category.id]);
        }
        await queryRunner.query(`ALTER TABLE category ALTER COLUMN code SET NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE category ALTER COLUMN code DROP NOT NULL`);
    }
    generateCode(name) {
        const cleanName = name.replace(/[^a-zA-Zа-яА-Я0-9]/g, '');
        const code = cleanName.slice(0, 4).toUpperCase();
        return code.padEnd(4, '0');
    }
}
exports.UpdateCategoryCodes1716120000000 = UpdateCategoryCodes1716120000000;
//# sourceMappingURL=1716120000000-UpdateCategoryCodes.js.map