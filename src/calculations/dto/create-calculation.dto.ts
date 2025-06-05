import { IsString, IsNotEmpty, IsObject, IsNumber, ValidateNested, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CalculationData, CalculationCategory, CalculationItem, CalculationSettings, CellConfig, CellMaterial } from '../interfaces/calculation-data.interface';

export class CreateItemDto implements CalculationItem {
  @ApiProperty({ 
    example: 1,
    description: 'ID материала из справочника материалов'
  })
  @IsNumber()
  id: number;

  @ApiProperty({ 
    example: 'Кабель ВВГнг-LS 3x2.5',
    description: 'Наименование материала'
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    example: 'м',
    description: 'Единица измерения (шт, м, кг и т.д.)'
  })
  @IsString()
  unit: string;

  @ApiProperty({ 
    example: 1000,
    description: 'Цена за единицу измерения'
  })
  @IsNumber()
  price: number;

  @ApiProperty({ 
    example: 1,
    description: 'Количество материала'
  })
  @IsNumber()
  quantity: number;
}

export class CreateCategoryDto implements CalculationCategory {
  @ApiProperty({ 
    example: 'Кабельная продукция',
    description: 'Название категории материалов'
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    type: [CreateItemDto],
    description: 'Список материалов в категории'
  })
  @ValidateNested({ each: true })
  @Type(() => CreateItemDto)
  items: CreateItemDto[];
}

export class CreateCellMaterialDto implements CellMaterial {
  @ApiProperty({ 
    example: 1,
    description: 'ID оборудования из справочника'
  })
  @IsNumber()
  id: number;

  @ApiProperty({ 
    example: 'Выключатель ВА57-35',
    description: 'Наименование оборудования'
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    example: 50000,
    description: 'Цена оборудования'
  })
  @IsNumber()
  price: number;

  @ApiProperty({ 
    enum: ['switch', 'rza', 'counter', 'sr', 'tsn', 'tn'],
    description: 'Тип оборудования: выключатель, РЗА, счетчик, СР, ТСН или ТН',
    example: 'switch'
  })
  @IsEnum(['switch', 'rza', 'counter', 'sr', 'tsn', 'tn'])
  type: 'switch' | 'rza' | 'counter' | 'sr' | 'tsn' | 'tn';
}

export class CreateCellConfigDto implements CellConfig {
  @ApiProperty({ 
    enum: ['0.4kv', '10kv', '20kv', 'rza'],
    description: 'Тип ячейки: 0.4кВ, 10кВ, 20кВ или РЗА',
    example: '0.4kv'
  })
  @IsEnum(['0.4kv', '10kv', '20kv', 'rza'])
  type: '0.4kv' | '10kv' | '20kv' | 'rza';

  @ApiProperty({
    description: 'Конфигурация оборудования ячейки',
    example: {
      switch: { id: 1, name: 'Выключатель ВА57-35', price: 50000, type: 'switch' },
      rza: { id: 2, name: 'РЗА Устройство', price: 75000, type: 'rza' },
      counter: { id: 3, name: 'Счетчик Меркурий', price: 25000, type: 'counter' },
      sr: { id: 4, name: 'СР Устройство', price: 30000, type: 'sr' },
      tsn: { id: 5, name: 'ТСН Трансформатор', price: 45000, type: 'tsn' },
      tn: { id: 6, name: 'ТН Трансформатор', price: 40000, type: 'tn' }
    }
  })
  @IsObject()
  materials: {
    switch?: CreateCellMaterialDto;
    rza?: CreateCellMaterialDto;
    counter?: CreateCellMaterialDto;
    sr?: CreateCellMaterialDto;
    tsn?: CreateCellMaterialDto;
    tn?: CreateCellMaterialDto;
  };
}

export class CreateCalculationSettingsDto implements CalculationSettings {
  @ApiProperty({ 
    example: 1,
    description: 'Количество часов на производство'
  })
  @IsNumber()
  manufacturingHours: number;

  @ApiProperty({ 
    example: 2000,
    description: 'Часовая ставка (тенге)'
  })
  @IsNumber()
  hourlyRate: number;

  @ApiProperty({ 
    example: 10,
    description: 'Процент общепроизводственных расходов'
  })
  @IsNumber()
  overheadPercentage: number;

  @ApiProperty({ 
    example: 15,
    description: 'Процент административных расходов'
  })
  @IsNumber()
  adminPercentage: number;

  @ApiProperty({ 
    example: 10,
    description: 'Процент плановых накоплений'
  })
  @IsNumber()
  plannedProfitPercentage: number;

  @ApiProperty({ 
    example: 12,
    description: 'Ставка НДС в процентах'
  })
  @IsNumber()
  ndsPercentage: number;
}

export class CreateCalculationDataDto implements CalculationData {
  @ApiProperty({ 
    type: [CreateCategoryDto],
    description: 'Список категорий с материалами'
  })
  @ValidateNested({ each: true })
  @Type(() => CreateCategoryDto)
  categories: CreateCategoryDto[];

  @ApiProperty({ 
    type: CreateCalculationSettingsDto,
    description: 'Настройки расчета (часы, ставки, проценты)'
  })
  @ValidateNested()
  @Type(() => CreateCalculationSettingsDto)
  calculation: CreateCalculationSettingsDto;

  @ApiProperty({ 
    type: CreateCellConfigDto,
    description: 'Конфигурация ячейки (тип и оборудование)'
  })
  @ValidateNested()
  @Type(() => CreateCellConfigDto)
  cellConfig: CreateCellConfigDto;
}

export class CreateCalculationDto {
  @ApiProperty({ 
    example: 'Камера КСО А12-10 900×1000',
    description: 'Название калькуляции'
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    example: '900x1000',
    description: 'Уникальный идентификатор калькуляции (slug)'
  })
  @IsString()
  slug: string;

  @ApiProperty({ 
    example: 1,
    description: 'ID группы калькуляций'
  })
  @IsNumber()
  @IsNotEmpty()
  groupId: number;

  @ApiProperty({ 
    type: CreateCalculationDataDto,
    description: 'Данные калькуляции (категории, настройки, конфигурация ячейки)'
  })
  @ValidateNested()
  @Type(() => CreateCalculationDataDto)
  data: CreateCalculationDataDto;
}