import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'aidar' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'yerlal' })
  @IsString()
  password: string;
}
