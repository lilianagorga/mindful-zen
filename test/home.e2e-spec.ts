import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('HomeController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/home (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/home');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Welcome to the Mindful Zen API!',
    });
  });
});
