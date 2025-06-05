import { IsNumber, IsString, IsBoolean, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CategorySettingDto {
    @ApiProperty({
        example: 1,
        description: 'ID категории из базы данных',
        type: Number,
        required: true
    })
    @IsNumber()
    categoryId: number;

    @ApiProperty({
        example: 'switch',
        description: 'Тип настройки (может быть любая строка)',
        type: String,
        required: true
    })
    @IsString()
    type: string;

    @ApiProperty({
        example: true,
        description: 'Видимость настройки в интерфейсе',
        type: Boolean,
        default: true,
        required: true
    })
    @IsBoolean()
    isVisible: boolean;
}

export class EquipmentSettingsDto {
    @ApiProperty({
        type: [CategorySettingDto],
        description: 'Настройки для РУСН (Распределительное устройство среднего напряжения)',
        example: [
            {
                categoryId: 1,
                type: 'switch',
                isVisible: true
            }
        ],
        required: false
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CategorySettingDto)
    @IsOptional()
    rusn: CategorySettingDto[] = [];

    @ApiProperty({
        type: [CategorySettingDto],
        description: 'Настройки для БМЗ (Блок мотор-генератор)',
        example: [
            {
                categoryId: 2,
                type: 'counter',
                isVisible: true
            }
        ],
        required: false
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CategorySettingDto)
    @IsOptional()
    bmz: CategorySettingDto[] = [];

    @ApiProperty({
        type: [CategorySettingDto],
        description: 'Настройки для РУНН (Распределительное устройство низкого напряжения)',
        example: [
            {
                categoryId: 3,
                type: 'rza',
                isVisible: true
            }
        ],
        required: false
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
        ],
        required: false
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
        ],
        required: false
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
        ],
        required: false
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CategorySettingDto)
    @IsOptional()
    additionalEquipment: CategorySettingDto[] = [];

    @ApiProperty({
        type: [CategorySettingDto],
        description: 'Настройки для СР (Система релейной защиты)',
        example: [
            {
                categoryId: 7,
                type: 'switch',
                isVisible: true
            }
        ],
        required: false
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CategorySettingDto)
    @IsOptional()
    sr: CategorySettingDto[] = [];

    @ApiProperty({
        type: [CategorySettingDto],
        description: 'Настройки для ТСН (Трансформатор собственных нужд)',
        example: [
            {
                categoryId: 8,
                type: 'counter',
                isVisible: true
            }
        ],
        required: false
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CategorySettingDto)
    @IsOptional()
    tsn: CategorySettingDto[] = [];

    @ApiProperty({
        type: [CategorySettingDto],
        description: 'Настройки для ТН (Трансформатор напряжения)',
        example: [
            {
                categoryId: 9,
                type: 'transformer',
                isVisible: true
            }
        ],
        required: false
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CategorySettingDto)
    @IsOptional()
    tn: CategorySettingDto[] = [];
}

export class CreateSettingDto {
    @ApiProperty({
        type: EquipmentSettingsDto,
        description: 'Настройки для всех типов оборудования. При обновлении можно отправить только те секции, которые нужно изменить.',
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
        },
        required: true
    })
    @ValidateNested()
    @Type(() => EquipmentSettingsDto)
    settings: EquipmentSettingsDto;
} 