import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTransformerPrice1710123456789 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Сначала обновим существующие null значения на 0
    await queryRunner.query(`
      UPDATE transformer 
      SET price = 0 
      WHERE price IS NULL
    `);

    // Затем изменим тип колонки
    await queryRunner.query(`
      ALTER TABLE transformer 
      ALTER COLUMN price TYPE integer USING price::integer,
      ALTER COLUMN price SET NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Возвращаем колонку к предыдущему состоянию
    await queryRunner.query(`
      ALTER TABLE transformer 
      ALTER COLUMN price DROP NOT NULL,
      ALTER COLUMN price TYPE decimal(10,2)
    `);
  }
} 