import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTransformerDto } from './create-transformer.dto';

export class CreateTransformersDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateTransformerDto)
  transformers: CreateTransformerDto[];
} 