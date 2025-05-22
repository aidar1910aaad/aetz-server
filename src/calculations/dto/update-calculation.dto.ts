import { IsString, IsNotEmpty, IsObject, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCalculationDto {
    @ApiPropertyOptional({
        example: 'Камера КСО А12-10 900×1000',
        description: 'Новое название калькуляции (необязательно)'
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({
        example: '900x1000',
        description: 'Новый slug калькуляции (необязательно)'
    })
    @IsOptional()
    @IsString()
    slug?: string;

    @ApiPropertyOptional({
        example: {
            categories: [
                {
                    name: "Категория 1",
                    items: [
                        {
                            id: 1,
                            name: "Материал 1",
                            quantity: 2,
                            price: 1000
                        }
                    ]
                }
            ]
        },
        description: 'Данные калькуляции (необязательно). Можно отправить как полные данные, так и только измененные части'
    })
    @IsOptional()
    @IsObject()
    data?: any;
} 