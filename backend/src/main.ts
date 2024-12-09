import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for development
  app.enableCors({
    origin: 'http://localhost:3000', // or whatever port your React app runs on
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Global prefix for all routes
  app.setGlobalPrefix('api');
  
  await app.listen(8000);
  console.log(`Application is running on: http://localhost:3000/api`);
}
bootstrap();