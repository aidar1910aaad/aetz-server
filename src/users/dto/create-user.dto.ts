import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'john_doe' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'strongpassword' })
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: 'john@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+77001234567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'ПТО инженер' })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({ example: 'Казахстан' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: 'Астана' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: '010000' })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional({ enum: UserRole, example: UserRole.PTO })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
