import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, Min } from 'class-validator';

export class UpdateCurrencySettingsDto {
    @ApiProperty({ example: 1, description: 'Курс доллара США (USD)', required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    usdRate?: number;

    @ApiProperty({ example: 1.08, description: 'Курс евро (EUR)', required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    eurRate?: number;

    @ApiProperty({ example: 92.5, description: 'Курс российского рубля (RUB)', required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    rubRate?: number;

    @ApiProperty({ example: 450, description: 'Курс казахстанского тенге (KZT)', required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    kztRate?: number;

    @ApiProperty({ example: 'USD', description: 'Базовая валюта по умолчанию', required: false })
    @IsOptional()
    @IsString()
    defaultCurrency?: string;

    @ApiProperty({ example: 2000, description: 'Часовая заработная плата (₸)', required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    hourlyWage?: number;

    @ApiProperty({ example: 12, description: 'НДС (%)', required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    vatRate?: number;

    @ApiProperty({ example: 15, description: 'Административные расходы (%)', required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    administrativeExpenses?: number;

    @ApiProperty({ example: 10, description: 'Плановые накопления (%)', required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    plannedSavings?: number;

    @ApiProperty({ example: 10, description: 'Общепроизводственные расходы (%)', required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    productionExpenses?: number;
} 