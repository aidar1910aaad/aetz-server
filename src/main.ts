import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
    forbidNonWhitelisted: true,
  }));

  // 📚 Swagger
  const config = new DocumentBuilder()
    .setTitle('AETZ API')
    .setDescription(`
      <h2>Добро пожаловать в API документацию AETZ</h2>
      <p>Здесь вы найдете все необходимые эндпоинты для работы с системой.</p>
      <h3>Как начать:</h3>
      <ol>
        <li>Авторизуйтесь через <code>/auth/login</code></li>
        <li>Скопируйте полученный токен</li>
        <li>Нажмите кнопку "Authorize" и вставьте токен</li>
      </ol>
      <h3>Основные разделы:</h3>
      <ul>
        <li>🔐 <b>Аутентификация</b> - вход в систему</li>
        <li>👥 <b>Пользователи</b> - управление пользователями</li>
        <li>📦 <b>Материалы</b> - работа с материалами</li>
        <li>📋 <b>Категории</b> - управление категориями</li>
        <li>🧮 <b>Расчеты</b> - работа с расчетами</li>
        <li>⚙️ <b>Настройки</b> - системные настройки</li>
        <li>💱 <b>Валюты</b> - настройки валют</li>
        <li>🔌 <b>Трансформаторы</b> - работа с трансформаторами</li>
        <li>🏭 <b>БМЗ</b> - работа с БМЗ</li>
        <li>⚡ <b>РУ</b> - работа с распределительными устройствами</li>
      </ul>
    `)
    .setVersion('1.0')
    .addTag('Аутентификация', 'Вход в систему и управление токенами')
    .addTag('Пользователи', 'Управление пользователями системы')
    .addTag('Материалы', 'Работа с материалами и их свойствами')
    .addTag('Категории', 'Управление категориями материалов')
    .addTag('Расчеты', 'Работа с расчетами и их группами')
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
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      syntaxHighlight: {
        theme: 'monokai'
      },
      tryItOutEnabled: true,
      requestInterceptor: (req) => {
        req.credentials = 'include';
        return req;
      },
      defaultModelsExpandDepth: 3,
      defaultModelExpandDepth: 3,
      displayRequestDuration: true,
      showExtensions: true,
      showCommonExtensions: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'AETZ API Documentation',
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
