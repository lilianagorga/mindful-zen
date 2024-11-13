import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let createdUserId: number;
  let adminToken: string;
  let userToken: string;
  let createdAdminId: number;
  let testUserId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dataSource = app.get(DataSource);

    const adminRegisterResponse = await request(app.getHttpServer())
      .post('/users/register')
      .send({
        email: 'admin@example.com',
        password: 'AdminPassword123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
      })
      .expect(201);
    createdAdminId = adminRegisterResponse.body.user?.id;
    expect(createdAdminId).toBeDefined();

    const adminLoginResponse = await request(app.getHttpServer())
      .post('/users/login')
      .send({
        email: 'admin@example.com',
        password: 'AdminPassword123',
      })
      .expect(200);
    adminToken = adminLoginResponse.body.token;
    expect(adminToken).toBeDefined();

    const userRegisterResponse = await request(app.getHttpServer())
      .post('/users/register')
      .send({
        email: 'user@example.com',
        password: 'UserPassword123',
        firstName: 'Regular',
        lastName: 'User',
        role: 'user',
      })
      .expect(201);
    createdUserId = userRegisterResponse.body.user?.id;
    expect(createdUserId).toBeDefined();

    const userLoginResponse = await request(app.getHttpServer())
      .post('/users/login')
      .send({
        email: 'user@example.com',
        password: 'UserPassword123',
      })
      .expect(200);
    userToken = userLoginResponse.body.token;
    expect(userToken).toBeDefined();
  });

  afterEach(async () => {
    if (testUserId) {
      await dataSource
        .createQueryBuilder()
        .delete()
        .from('users')
        .where('id = :id', { id: testUserId })
        .execute();
    }
    if (createdAdminId) {
      await dataSource
        .createQueryBuilder()
        .delete()
        .from('users')
        .where('id = :id', { id: createdAdminId })
        .execute();
    }
  });

  afterAll(async () => {
    if (createdUserId) {
      await dataSource
        .createQueryBuilder()
        .delete()
        .from('users')
        .where('id = :id', { id: createdUserId })
        .execute();
    }
    await app.close();
  });

  it('/users (GET) - should return all users for admin', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/users (GET) - should return 403 for non-admin user', async () => {
    await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });

  it('should allow an admin to create and retrieve a new user by ID', async () => {
    const createUserResponse = await request(app.getHttpServer())
      .post('/users/register')
      .send({
        email: 'testuser@example.com',
        password: 'TestUser123',
        firstName: 'Test',
        lastName: 'User',
        role: 'user',
      })
      .expect(201);

    const testUser = createUserResponse.body.user;
    expect(testUser).toBeDefined();
    expect(testUser.id).toBeDefined();
    testUserId = testUser.id;

    const getUserResponse = await request(app.getHttpServer())
      .get(`/users/${testUser.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(getUserResponse.body).toMatchObject({
      email: 'testuser@example.com',
      firstName: 'Test',
      lastName: 'User',
    });
  });

  it('should allow a user to retrieve their own data', async () => {
    const getUserResponse = await request(app.getHttpServer())
      .get(`/users/${createdUserId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(getUserResponse.body).toMatchObject({
      email: 'user@example.com',
      firstName: 'Regular',
      lastName: 'User',
    });
  });

  it("should not allow a user to retrieve another user's data", async () => {
    await request(app.getHttpServer())
      .get(`/users/${createdAdminId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });
});
