import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCategoryCodes1716120000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Получаем все категории
        const categories = await queryRunner.query(`SELECT id, name FROM category`);

        // Для каждой категории генерируем код на основе имени
        for (const category of categories) {
            const code = this.generateCode(category.name);
            await queryRunner.query(
                `UPDATE category SET code = $1 WHERE id = $2`,
                [code, category.id]
            );
        }

        // После заполнения всех кодов, делаем поле обязательным
        await queryRunner.query(`ALTER TABLE category ALTER COLUMN code SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // При откате просто делаем поле необязательным
        await queryRunner.query(`ALTER TABLE category ALTER COLUMN code DROP NOT NULL`);
    }

    private generateCode(name: string): string {
        // Удаляем все кроме букв и цифр
        const cleanName = name.replace(/[^a-zA-Zа-яА-Я0-9]/g, '');
        
        // Берем первые 4 символа и переводим в верхний регистр
        const code = cleanName.slice(0, 4).toUpperCase();
        
        // Если код короче 4 символов, дополняем нулями
        return code.padEnd(4, '0');
    }
} 