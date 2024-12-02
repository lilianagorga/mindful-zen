import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';
import * as jwt from 'jsonwebtoken';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.use((req, res, next) => {
    const token = req.cookies?.jwt || req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = payload;
      } catch (err) {
        console.error('Error codifying token:', err.message);
      }
    }
    next();
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.use(
    '/favicon.ico',
    express.static(join(__dirname, '..', 'public', 'favicon.ico')),
  );
  app.setBaseViewsDir(join(__dirname, '..', 'src', 'views'));
  app.setViewEngine('ejs');
  if (
    process.env.NODE_ENV === 'test' ||
    process.env.NODE_ENV === 'development'
  ) {
    app.useLogger(['log', 'error', 'warn', 'debug']);
  }
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
