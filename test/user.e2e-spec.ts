import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let createdUserId: number;
  let createdIntervalId: number;

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

  it('/users (GET)', async () => {
    await request(app.getHttpServer()).get('/users').expect(200).expect([]);
  });

  it('should create and retrieve a user', async () => {
    const createUserResponse = await request(app.getHttpServer())
      .post('/users')
      .send({ email: 'test@example.com', firstName: 'Test', lastName: 'User' })
      .expect(201);
    createdUserId = createUserResponse.body.id;

    const getUsersResponse = await request(app.getHttpServer())
      .get('/users')
      .expect(200);
    expect(getUsersResponse.body).toContainEqual(
      expect.objectContaining({
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      }),
    );
  });

  it('should create and retrieve a specific user by ID', async () => {
    const createUserResponse = await request(app.getHttpServer())
      .post('/users')
      .send({
        email: 'specific@example.com',
        firstName: 'Specific',
        lastName: 'User',
      })
      .expect(201);
    createdUserId = createUserResponse.body.id;

    const getUserResponse = await request(app.getHttpServer())
      .get(`/users/${createdUserId}`)
      .expect(200);

    expect(getUserResponse.body).toMatchObject({
      email: 'specific@example.com',
      firstName: 'Specific',
      lastName: 'User',
    });
  });
});
