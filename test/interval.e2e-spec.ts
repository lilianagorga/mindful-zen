import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('IntervalController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let createdUserId: number;
  let createdIntervalId: number;
  let userToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dataSource = app.get(DataSource);
  });

  afterEach(async () => {
    if (createdIntervalId) {
      await dataSource
        .createQueryBuilder()
        .delete()
        .from('intervals')
        .where('id = :id', { id: createdIntervalId })
        .execute();
    }
    if (createdUserId) {
      await dataSource
        .createQueryBuilder()
        .delete()
        .from('users')
        .where('id = :id', { id: createdUserId })
        .execute();
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it('/intervals (GET)', async () => {
    await request(app.getHttpServer()).get('/intervals').expect(200).expect([]);
  });

  it('should create and retrieve an interval', async () => {
    const userResponse = await request(app.getHttpServer())
      .post('/users/register')
      .send({
        email: 'testUserInterval@example.com',
        password: 'TestPassword123',
        firstName: 'Test',
        lastName: 'User',
        role: 'user',
      })
      .expect(201);
    createdUserId = userResponse.body.user?.id;
    expect(createdUserId).toBeDefined();

    const loginResponse = await request(app.getHttpServer())
      .post('/users/login')
      .send({
        email: 'testUserInterval@example.com',
        password: 'TestPassword123',
      })
      .expect(200);
    userToken = loginResponse.body.token;
    expect(userToken).toBeDefined();
    const intervalData = {
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 3600 * 1000).toISOString(),
      userId: createdUserId,
    };

    const intervalResponse = await request(app.getHttpServer())
      .post('/intervals')
      .set('Authorization', `Bearer ${userToken}`)
      .send(intervalData)
      .expect(201);
    createdIntervalId = intervalResponse.body.id;

    const getIntervalsResponse = await request(app.getHttpServer())
      .get('/intervals')
      .expect(200);

    expect(getIntervalsResponse.body).toContainEqual(
      expect.objectContaining({
        startDate: intervalData.startDate,
        endDate: intervalData.endDate,
        userId: createdUserId,
      }),
    );
  });
});
