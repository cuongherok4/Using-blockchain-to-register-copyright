import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, Logger, BadRequestException } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  app.enableCors();
  
  // ✅ ValidationPipe với response chi tiết
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors) => {
      const logger = new Logger('DTOValidation');
      
      // Log chi tiết lỗi
      logger.error('Validation errors:', JSON.stringify(errors, null, 2));
      
      // Trả về response chi tiết
      const formattedErrors = errors.map(error => ({
        field: error.property,
        errors: Object.values(error.constraints || {}),
        value: error.value
      }));
      
      return new BadRequestException({
        statusCode: 400,
        message: 'Validation failed',
        errors: formattedErrors
      });
    }
  }));

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();