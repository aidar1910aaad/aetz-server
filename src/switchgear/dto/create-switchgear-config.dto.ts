import { IsString, IsNumber, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class CellDto {
  @ApiProperty({
    example: 'Ввод',
    description: 'Название ячейки (например: Ввод, СВ, ОТХ)',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 2,
    description: 'Количество ячеек данного типа',
    minimum: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class CreateSwitchgearConfigDto {
  @ApiProperty({
    example: 'КСО 12-10',
    description: 'Тип ячейки РУ (например: КСО 12-10, КМ)',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    example: 'AV-12 1250',
    description: 'Модель выключателя',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  breaker: string;

  @ApiProperty({
    example: 870,
    description: 'Номинальный ток в амперах',
    minimum: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  amperage: number;

  @ApiProperty({
    example: 'АД',
    description: 'Группа ячеек (например: АД - асинхронные двигатели)',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  group: string;

  @ApiProperty({
    example: '60x6',
    description: 'Размер шины (например: 60x6)',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  busbar: string;

  @ApiProperty({
    type: [CellDto],
    description: 'Список ячеек с их количеством',
    example: [
      { name: 'Ввод', quantity: 2 },
      { name: 'СВ', quantity: 1 },
      { name: 'ОТХ', quantity: 10 }
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CellDto)
  cells: CellDto[];
} 