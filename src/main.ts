import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './common/config/env.config';
import { swaggerConfig } from './common/config/swagger-config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/error-handler/error.gandler';

const port = env.PORT
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {logger: ['error', 'warn']});
  app.useGlobalPipes(new ValidationPipe({whitelist:true, transform:true}))
  app.useGlobalFilters(new GlobalExceptionFilter());
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);
  await app.listen(3000,()=> console.log(`server is running on port ${port}`));
}
bootstrap();
