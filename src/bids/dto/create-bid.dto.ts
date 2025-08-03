import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsObject,
  IsOptional,
  IsNotEmpty,
  ValidateNested,
  IsNumber,
  IsString,
} from 'class-validator';

class MetaUserDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'ivanov' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'Иван' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Иванов' })
  @IsString()
  lastName: string;
}

class MetaDto {
  @ApiProperty({ example: '12345' })
  @IsNotEmpty()
  @IsString()
  taskNumber: string;

  @ApiProperty({ example: '2024-05-30' })
  @IsNotEmpty()
  @IsString()
  date: string;

  @ApiProperty({ example: 'ООО Ромашка' })
  @IsNotEmpty()
  @IsString()
  client: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => MetaUserDto)
  user: MetaUserDto;

  @ApiProperty({ example: 'БКТП' })
  @IsNotEmpty()
  @IsString()
  type: string;
}

export class CreateBidDto {
  @ApiProperty({ type: MetaDto, description: 'Meta information' })
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MetaDto)
  meta: MetaDto;

  @ApiPropertyOptional({ type: 'object', description: 'BMZ data', additionalProperties: true })
  @IsObject()
  @IsOptional()
  bmz?: any;

  @ApiPropertyOptional({ type: 'object', description: 'Transformer data', additionalProperties: true })
  @IsObject()
  @IsOptional()
  transformer?: any;

  @ApiPropertyOptional({ type: 'object', description: 'RUSN data', additionalProperties: true })
  @IsObject()
  @IsOptional()
  rusn?: any;

  @ApiPropertyOptional({ type: 'object', description: 'Additional equipment data', additionalProperties: true })
  @IsObject()
  @IsOptional()
  additionalEquipment?: any;

  @ApiPropertyOptional({ type: 'object', description: 'Works data', additionalProperties: true })
  @IsObject()
  @IsOptional()
  works?: any;

  @ApiPropertyOptional({ type: 'object', description: 'Totals data', additionalProperties: true })
  @IsObject()
  @IsOptional()
  totals?: any;
} 