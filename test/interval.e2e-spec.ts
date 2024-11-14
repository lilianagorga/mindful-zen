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
  let adminToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dataSource = app.get(DataSource);
  });

  beforeEach(async () => {
    const adminRegisterResponse = await request(app.getHttpServer())
      .post('/users/register')
      .send({
        email: 'testAdminInterval@example.com',
        password: 'AdminPassword123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
      })
      .expect(201);
    createdUserId = adminRegisterResponse.body.user?.id;
    expect(createdUserId).toBeDefined();

    const adminLoginResponse = await request(app.getHttpServer())
      .post('/users/login')
      .send({
        email: 'testAdminInterval@example.com',
        password: 'AdminPassword123',
      })
      .expect(200);
    adminToken = adminLoginResponse.body.token;
    expect(adminToken).toBeDefined();
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
    await request(app.getHttpServer())
      .get('/intervals')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect([]);
  });

  it('should create and retrieve an interval', async () => {
    const intervalData = {
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 3600 * 1000).toISOString(),
      userId: createdUserId,
    };

    const intervalResponse = await request(app.getHttpServer())
      .post('/intervals')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(intervalData)
      .expect(201);
    createdIntervalId = intervalResponse.body.id;

    const getIntervalsResponse = await request(app.getHttpServer())
      .get('/intervals')
      .set('Authorization', `Bearer ${adminToken}`)
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
