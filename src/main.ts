import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Включаем CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'https://aetz-client.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // если нужно передавать токен/cookie
  });

  const config = new DocumentBuilder()
  .setTitle('Aetz API')
  .setDescription('Документация для API проекта Aetz')
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
    'access-token', // 👈 имя схемы (важно!)
  )
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);


  await app.listen(process.env.PORT || 3000);
}
bootstrap();

