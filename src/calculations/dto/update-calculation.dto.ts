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
                type: "input",
                materials: {
                    switch: {
                        id: 1,
                        name: "Выключатель ВА57-35",
                        price: 50000,
                        type: "switch"
                    },
                    tt: [
                        { id: 7, name: 'ТТ Трансформатор тока', price: 15000, type: 'switch' },
                        { id: 8, name: 'ТТ Трансформатор тока 2', price: 18000, type: 'switch' }
                    ],
                    pu: [
                        { id: 9, name: 'ПУ Прибор учета', price: 12000, type: 'counter' },
                        { id: 10, name: 'ПУ Прибор учета 2', price: 14000, type: 'counter' }
                    ],
                    disconnector: [
                        { id: 11, name: 'Разъединитель РЛНД', price: 25000, type: 'disconnector' },
                        { id: 12, name: 'Разъединитель РЛНД 2', price: 28000, type: 'disconnector' }
                    ],
                    busbar: [
                        { id: 13, name: 'Шина медная 60x6', price: 8000, type: 'busbar' },
                        { id: 14, name: 'Шина медная 80x8', price: 10000, type: 'busbar' }
                    ],
                    busbridge: [
                        { id: 15, name: 'Шинный мост 60x6', price: 12000, type: 'busbridge' },
                        { id: 16, name: 'Шинный мост 80x8', price: 15000, type: 'busbridge' }
                    ]
                }
            }
        }
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => CreateCalculationDataDto)
    data?: CreateCalculationDataDto;
} 