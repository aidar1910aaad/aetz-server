import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ 
    summary: 'Вход в систему',
    description: 'Аутентификация пользователя и получение JWT токена'
  })
  @ApiBody({ 
    type: LoginDto,
    description: 'Учетные данные пользователя',
    examples: {
      admin: {
        value: {
          username: 'aidarr',
          password: 'yerlal'
        },
        summary: 'Пример входа администратора'
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Успешный вход',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'JWT токен для авторизации',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        },
        user: {
          type: 'object',
          properties: {
            id: { 
              type: 'number',
              example: 1
            },
            username: { 
              type: 'string',
              example: 'admin'
            },
            role: { 
              type: 'string',
              enum: ['ADMIN', 'PTO', 'USER'],
              example: 'ADMIN'
            }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Неверные учетные данные',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 401
        },
        message: {
          type: 'string',
          example: 'Неверные учетные данные'
        }
      }
    }
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
