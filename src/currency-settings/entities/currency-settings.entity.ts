import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class CurrencySettings {
    @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: 1, description: 'Курс доллара США (USD)' })
    @Column('decimal', { precision: 10, scale: 2, default: 1 })
    usdRate: number;

    @ApiProperty({ example: 1.08, description: 'Курс евро (EUR)' })
    @Column('decimal', { precision: 10, scale: 2, default: 1.08 })
    eurRate: number;

    @ApiProperty({ example: 92.5, description: 'Курс российского рубля (RUB)' })
    @Column('decimal', { precision: 10, scale: 2, default: 92.5 })
    rubRate: number;

    @ApiProperty({ example: 450, description: 'Курс казахстанского тенге (KZT)' })
    @Column('decimal', { precision: 10, scale: 2, default: 450 })
    kztRate: number;

    @ApiProperty({ example: 'USD', description: 'Базовая валюта по умолчанию' })
    @Column({ default: 'USD' })
    defaultCurrency: string;

    @ApiProperty({ example: 2000, description: 'Часовая заработная плата (₸)' })
    @Column('decimal', { precision: 10, scale: 2, default: 2000 })
    hourlyWage: number;

    @ApiProperty({ example: 12, description: 'НДС (%)' })
    @Column('decimal', { precision: 5, scale: 2, default: 12 })
    vatRate: number;

    @ApiProperty({ example: 15, description: 'Административные расходы (%)' })
    @Column('decimal', { precision: 5, scale: 2, default: 15 })
    administrativeExpenses: number;

    @ApiProperty({ example: 10, description: 'Плановые накопления (%)' })
    @Column('decimal', { precision: 5, scale: 2, default: 10 })
    plannedSavings: number;

    @ApiProperty({ example: 10, description: 'Общепроизводственные расходы (%)' })
    @Column('decimal', { precision: 5, scale: 2, default: 10 })
    productionExpenses: number;

    @ApiProperty({ example: '2024-03-20T10:00:00Z', description: 'Дата создания' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ example: '2024-03-20T10:00:00Z', description: 'Дата последнего обновления' })
    @UpdateDateColumn()
    updatedAt: Date;
} 