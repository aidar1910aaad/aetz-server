import { IsString, IsObject, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateCalculationDataDto } from './create-calculation.dto';

export class UpdateCalculationDto {
    @ApiPropertyOptional({
        example: 'Камера КСО А12-10 900×1000',
        description: 'Новое название калькуляции. Если не указано, останется прежним'
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({
        example: '900x1000',
        description: 'Новый уникальный идентификатор калькуляции (slug). Если не указан, останется прежним'
    })
    @IsOptional()
    @IsString()
    slug?: string;

    @ApiPropertyOptional({
        type: CreateCalculationDataDto,
        description: `Данные калькуляции. Можно обновить:
- Категории и материалы
- Настройки расчета (часы, ставки, проценты)
- Конфигурацию ячейки (тип и оборудование)
Если какие-то поля не указаны, они останутся без изменений`,
        example: {
            categories: [
                {
                    name: "Кабельная продукция",
                    items: [
                        {
                            id: 1,
                            name: "Кабель ВВГнг-LS 3x2.5",
                            unit: "м",
                            price: 1000,
                            quantity: 2
                        }
                    ]
                }
            ],
            calculation: {
                manufacturingHours: 1,
                hourlyRate: 2000,
                overheadPercentage: 10,
                adminPercentage: 15,
                plannedProfitPercentage: 10,
                ndsPercentage: 12
            },
            cellConfig: {
                type: "0.4kv",
                materials: {
                    switch: {
                        id: 1,
                        name: "Выключатель ВА57-35",
                        price: 50000,
                        type: "switch"
                    }
                }
            }
        }
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => CreateCalculationDataDto)
    data?: CreateCalculationDataDto;
} 