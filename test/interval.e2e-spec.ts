import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { Interval } from '../src/entities/interval.entity';

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

  it('should retrieve a single interval by id', async () => {
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
    const createdInterval = intervalResponse.body;
    createdIntervalId = createdInterval.id;

    const getIntervalResponse = await request(app.getHttpServer())
      .get(`/intervals/${createdIntervalId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(getIntervalResponse.body).toEqual(
      expect.objectContaining({
        id: createdIntervalId,
        startDate: intervalData.startDate,
        endDate: intervalData.endDate,
        userId: createdUserId,
      }),
    );
  });

  it('should update an interval', async () => {
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

    const updatedData = {
      endDate: new Date(Date.now() + 7200 * 1000).toISOString(),
    };
    const updateResponse = await request(app.getHttpServer())
      .put(`/intervals/${createdIntervalId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updatedData)
      .expect(200);

    expect(updateResponse.body.endDate).toBe(updatedData.endDate);
  });

  it('should partially update an interval', async () => {
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

    const updatedData = {
      startDate: new Date(Date.now() + 1800 * 1000).toISOString(),
    };
    const partialUpdateResponse = await request(app.getHttpServer())
      .patch(`/intervals/${createdIntervalId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updatedData)
      .expect(200);

    expect(partialUpdateResponse.body.startDate).toBe(updatedData.startDate);
  });

  it('should delete an interval', async () => {
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

    await request(app.getHttpServer())
      .delete(`/intervals/${createdIntervalId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const intervalExists = await dataSource
      .getRepository(Interval)
      .findOne({ where: { id: createdIntervalId } });
    expect(intervalExists).toBeNull();
  });
});
