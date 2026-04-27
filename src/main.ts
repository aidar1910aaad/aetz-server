import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const requestLogger = new Logger('HTTP');

  app.use((req, res, next) => {
    const startedAt = Date.now();
    requestLogger.log(`START ${req.method} ${req.originalUrl} - ${req.ip || 'unknown-ip'}`);

    res.on('finish', () => {
      const durationMs = Date.now() - startedAt;
      requestLogger.log(
        `${req.method} ${req.originalUrl} ${res.statusCode} - ${durationMs}ms - ${req.ip || 'unknown-ip'}`,
      );
    });

    next();
  });

  // 📦 Увеличить лимит размера тела запроса
  app.use(bodyParser.json({ limit: '20mb' }));
  app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

  // ✅ CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'https://aetz-client.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers'
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 3600,
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

  // Включаем валидацию
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: false,
  }));

  // 📚 Swagger
  const config = new DocumentBuilder()
    .setTitle('AETZ API')
    .setDescription(`
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <h2 style="color: #2563eb; margin-bottom: 20px;">🏢 AETZ API - Система управления электротехническими проектами</h2>
        <p style="font-size: 16px; color: #374151; margin-bottom: 25px;">
          Комплексная система для управления материалами, расчетами и проектами в области электротехники.
        </p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #1f2937; margin-bottom: 15px;">🚀 Быстрый старт</h3>
          <ol style="color: #374151; line-height: 1.6;">
            <li>Выполните авторизацию через <code style="background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">POST /auth/login</code></li>
            <li>Скопируйте полученный JWT токен</li>
            <li>Нажмите кнопку <strong>"Authorize"</strong> в правом верхнем углу</li>
            <li>Вставьте токен в формате: <code>Bearer ваш_токен</code></li>
          </ol>
        </div>

        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #92400e; margin-bottom: 15px;">⚠️ Важно</h3>
          <p style="color: #92400e; margin: 0;">
            Все эндпоинты требуют авторизации, кроме <code>/auth/login</code> и <code>/auth/register</code>
          </p>
        </div>

        <h3 style="color: #1f2937; margin-bottom: 15px;">📋 Основные модули системы</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px;">
          <div style="background: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6;">
            <strong>🔐 Аутентификация</strong><br>
            <span style="color: #6b7280; font-size: 14px;">Вход в систему и управление токенами</span>
          </div>
          <div style="background: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981;">
            <strong>👥 Пользователи</strong><br>
            <span style="color: #6b7280; font-size: 14px;">Управление пользователями системы</span>
          </div>
          <div style="background: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b;">
            <strong>📦 Материалы</strong><br>
            <span style="color: #6b7280; font-size: 14px;">Работа с материалами и их свойствами</span>
          </div>
          <div style="background: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #8b5cf6;">
            <strong>📋 Категории</strong><br>
            <span style="color: #6b7280; font-size: 14px;">Управление категориями материалов</span>
          </div>
          <div style="background: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #ef4444;">
            <strong>🧮 Расчеты</strong><br>
            <span style="color: #6b7280; font-size: 14px;">Работа с расчетами и их группами</span>
          </div>
          <div style="background: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #06b6d4;">
            <strong>📝 Заявки</strong><br>
            <span style="color: #6b7280; font-size: 14px;">Работа с заявками</span>
          </div>
          <div style="background: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #84cc16;">
            <strong>⚙️ Настройки</strong><br>
            <span style="color: #6b7280; font-size: 14px;">Системные настройки</span>
          </div>
          <div style="background: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #f97316;">
            <strong>💱 Валюты</strong><br>
            <span style="color: #6b7280; font-size: 14px;">Настройки валют и курсов</span>
          </div>
          <div style="background: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #ec4899;">
            <strong>🔌 Трансформаторы</strong><br>
            <span style="color: #6b7280; font-size: 14px;">Работа с трансформаторами</span>
          </div>
          <div style="background: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #6366f1;">
            <strong>🏭 БМЗ</strong><br>
            <span style="color: #6b7280; font-size: 14px;">Работа с блоками модульных зданий</span>
          </div>
          <div style="background: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #14b8a6;">
            <strong>⚡ РУ</strong><br>
            <span style="color: #6b7280; font-size: 14px;">Работа с распределительными устройствами</span>
          </div>
        </div>
      </div>
    `)
    .setVersion('1.0.0')
    .setContact('AETZ Team', 'https://aetz-client.vercel.app', 'support@aetz.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addTag('Аутентификация', 'Вход в систему и управление токенами')
    .addTag('Пользователи', 'Управление пользователями системы')
    .addTag('Материалы', 'Работа с материалами и их свойствами')
    .addTag('Категории', 'Управление категориями материалов')
    .addTag('Расчеты', 'Работа с расчетами и их группами')
    .addTag('Заявки', 'Работа с заявками')
    .addTag('Настройки', 'Системные настройки')
    .addTag('Валюты', 'Настройки валют и курсов')
    .addTag('Трансформаторы', 'Работа с трансформаторами')
    .addTag('БМЗ', 'Работа с блоками модульных зданий')
    .addTag('РУ', 'Работа с распределительными устройствами')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Введите JWT токен в формате: Bearer <token>',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
      syntaxHighlight: {
        theme: 'agate'
      },
      tryItOutEnabled: true,
      requestInterceptor: (req) => {
        req.credentials = 'include';
        return req;
      },
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
      displayRequestDuration: true,
      showExtensions: true,
      showCommonExtensions: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      deepLinking: true,
      displayOperationId: false,
      supportedSubmitMethods: ['get', 'post', 'put', 'patch', 'delete'],
      validatorUrl: null,
    },
    customSiteTitle: 'AETZ API - Документация',
    customfavIcon: 'https://aetz-client.vercel.app/favicon.ico',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
    ],
  });

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
