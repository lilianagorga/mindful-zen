import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('GoalController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let createdUserId: number;
  let createdIntervalId: number;
  let createdGoalId: number;
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
    const userResponse = await request(app.getHttpServer())
      .post('/users/register')
      .send({
        email: 'testAdminGoal@example.com',
        password: 'AdminPassword123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
      })
      .expect(201);
    createdUserId = userResponse.body.user?.id;
    expect(createdUserId).toBeDefined();

    const loginResponse = await request(app.getHttpServer())
      .post('/users/login')
      .send({
        email: 'testAdminGoal@example.com',
        password: 'AdminPassword123',
      })
      .expect(200);
    adminToken = loginResponse.body.token;
    expect(adminToken).toBeDefined();
  });

  afterEach(async () => {
    if (createdGoalId) {
      await dataSource
        .createQueryBuilder()
        .delete()
        .from('goals')
        .where('id = :id', { id: createdGoalId })
        .execute();
    }
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

  it('/goals (GET)', async () => {
    await request(app.getHttpServer())
      .get('/goals')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect([]);
  });

  it('should create and retrieve a goal', async () => {
    const intervalResponse = await request(app.getHttpServer())
      .post('/intervals')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 3600 * 1000).toISOString(),
        userId: createdUserId,
      })
      .expect(201);
    createdIntervalId = intervalResponse.body.id;
    expect(createdIntervalId).toBeDefined();

    const goalData = {
      name: 'Test Goal',
      intervalId: createdIntervalId,
    };

    const goalResponse = await request(app.getHttpServer())
      .post('/goals')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(goalData)
      .expect(201);
    createdGoalId = goalResponse.body.id;
    expect(createdGoalId).toBeDefined();
    const getGoalsResponse = await request(app.getHttpServer())
      .get('/goals')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(getGoalsResponse.body).toContainEqual(
      expect.objectContaining({
        name: goalData.name,
        intervalId: createdIntervalId,
      }),
    );
  });
});
