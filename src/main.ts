import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (process.env.NODE_ENV === 'test') {
    app.useLogger(['log', 'error', 'warn', 'debug']);
  }
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
