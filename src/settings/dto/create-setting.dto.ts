import { IsNumber, IsString, IsBoolean, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class CategorySettingDto {
    @ApiProperty({
        example: 1,
        description: 'ID категории',
        type: Number
    })
    @IsNumber()
    categoryId: number;

    @ApiProperty({
        example: 'switch',
        description: 'Тип настройки (switch, counter, rza, transformer, additionalEquipment)',
        type: String,
        enum: ['switch', 'counter', 'rza', 'transformer', 'additionalEquipment']
    })
    @IsString()
    type: string;

    @ApiProperty({
        example: true,
        description: 'Видимость настройки',
        type: Boolean,
        default: true
    })
    @IsBoolean()
    isVisible: boolean;
}

class EquipmentSettingsDto {
    @ApiProperty({
        type: [CategorySettingDto],
        description: 'Настройки для РУСН',
        example: [
            {
                categoryId: 1,
                type: 'switch',
                isVisible: true
            }
        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CategorySettingDto)
    @IsOptional()
    rusn: CategorySettingDto[] = [];

    @ApiProperty({
        type: [CategorySettingDto],
        description: 'Настройки для БМЗ',
        example: [
            {
                categoryId: 2,
                type: 'counter',
                isVisible: true
            }
        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CategorySettingDto)
    @IsOptional()
    bmz: CategorySettingDto[] = [];

    @ApiProperty({
        type: [CategorySettingDto],
        description: 'Настройки для РУНН',
        example: [
            {
                categoryId: 3,
                type: 'rza',
                isVisible: true
            }
        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CategorySettingDto)
    @IsOptional()
    runn: CategorySettingDto[] = [];

    @ApiProperty({
        type: [CategorySettingDto],
        description: 'Настройки для работы',
        example: [
            {
                categoryId: 4,
                type: 'transformer',
                isVisible: true
            }
        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CategorySettingDto)
    @IsOptional()
    work: CategorySettingDto[] = [];

    @ApiProperty({
        type: [CategorySettingDto],
        description: 'Настройки для трансформатора',
        example: [
            {
                categoryId: 5,
                type: 'counter',
                isVisible: true
            }
        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CategorySettingDto)
    @IsOptional()
    transformer: CategorySettingDto[] = [];

    @ApiProperty({
        type: [CategorySettingDto],
        description: 'Настройки для дополнительного оборудования',
        example: [
            {
                categoryId: 6,
                type: 'rza',
                isVisible: true
            }
        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CategorySettingDto)
    @IsOptional()
    additionalEquipment: CategorySettingDto[] = [];
}

export class CreateSettingDto {
    @ApiProperty({
        type: EquipmentSettingsDto,
        description: 'Настройки для всех типов оборудования',
        example: {
            rusn: [
                {
                    categoryId: 1,
                    type: 'switch',
                    isVisible: true
                }
            ],
            bmz: [
                {
                    categoryId: 2,
                    type: 'counter',
                    isVisible: true
                }
            ]
        }
    })
    @ValidateNested()
    @Type(() => EquipmentSettingsDto)
    settings: EquipmentSettingsDto;
} 