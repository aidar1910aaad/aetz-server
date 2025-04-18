import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from 'common/decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Вход пользователя' })
  @ApiResponse({ status: 200, description: 'Успешный вход и JWT токен' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
