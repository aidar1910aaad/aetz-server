import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BmzCalculatorService } from './bmz-calculator.service';

@ApiTags('Калькулятор БМЗ')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('bmz/calculator')
export class BmzCalculatorController {
  constructor(private readonly calculatorService: BmzCalculatorService) {}

  @Post('calculate')
  @ApiOperation({ 
    summary: 'Рассчитать стоимость БМЗ',
    description: 'Рассчитывает стоимость БМЗ на основе площади, толщины стен и выбранного оборудования'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        area: {
          type: 'number',
          description: 'Площадь помещения в квадратных метрах',
          example: 100
        },
        wallThickness: {
          type: 'number',
          description: 'Толщина стен в миллиметрах',
          example: 50
        },
        selectedEquipment: {
          type: 'array',
          items: {
            type: 'number'
          },
          description: 'Массив ID выбранного оборудования',
          example: [1, 2, 3]
        }
      },
      required: ['area', 'wallThickness', 'selectedEquipment']
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Возвращает расчет стоимости БМЗ',
    schema: {
      type: 'object',
      properties: {
        basePrice: {
          type: 'number',
          description: 'Базовая стоимость за площадь'
        },
        wallThicknessPrice: {
          type: 'number',
          description: 'Стоимость за толщину стен'
        },
        equipment: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Название оборудования'
              },
              price: {
                type: 'number',
                description: 'Стоимость оборудования'
              },
              description: {
                type: 'string',
                description: 'Описание расчета стоимости'
              }
            }
          }
        },
        totalPrice: {
          type: 'number',
          description: 'Общая стоимость'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Неверные входные данные'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Не авторизован'
  })
  async calculatePrice(
    @Body() params: {
      area: number;
      wallThickness: number;
      selectedEquipment: number[];
    }
  ) {
    return this.calculatorService.calculatePrice(params);
  }
} 