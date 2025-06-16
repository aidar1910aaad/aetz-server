import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'admin',
    minLength: 3,
    maxLength: 50
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'admin123',
    minLength: 6,
    maxLength: 50
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
