import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Электрооборудование',
    description: 'Название категории (должно быть уникальным)',
  })
  @IsString()
  name: string;
}
