import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('HomeController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let createdAdminId: number;
  let createdUserId: number;
  let testUserId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dataSource = app.get(DataSource);
    const adminRegisterResponse = await request(app.getHttpServer())
      .post('/register')
      .send({
        email: 'adminHome@example.com',
        password: 'AdminPassword123',
        firstName: 'AdminHome',
        lastName: 'User',
        role: 'admin',
        source: 'test',
      })
      .expect(201);
    createdAdminId = adminRegisterResponse.body.user?.id;
    expect(createdAdminId).toBeDefined();

    const userRegisterResponse = await request(app.getHttpServer())
      .post('/register')
      .send({
        email: 'userHome@example.com',
        password: 'UserPassword123',
        firstName: 'UserHome',
        lastName: 'Test',
        role: 'user',
        source: 'test',
      })
      .expect(201);
    createdUserId = userRegisterResponse.body.user?.id;
    expect(createdUserId).toBeDefined();
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

  it('/login (POST) - should login the registered user', async () => {
    const response = await request(app.getHttpServer())
      .post('/login')
      .send({
        email: 'userHome@example.com',
        password: 'UserPassword123',
      })
      .expect(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.message).toBe('Login successful');
  });

  it('/register (POST) - should register a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/register')
      .send({
        email: 'new_userHome@example.com',
        password: 'NewUser123',
        firstName: 'New',
        lastName: 'UserHome',
        role: 'user',
        source: 'test',
      })
      .expect(201);
    expect(response.body.user).toBeDefined();
    expect(response.body.token).toBeDefined();
    testUserId = response.body.user.id;
  });

  it('/logout (GET) - should successfully logout and invalidate the token', async () => {
    const userLoginResponse = await request(app.getHttpServer())
      .post('/login')
      .send({
        email: 'userHome@example.com',
        password: 'UserPassword123',
      })
      .expect(200);
    const userToken = userLoginResponse.body.token;

    const response = await request(app.getHttpServer())
      .get('/logout')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);
    expect(response.body.message).toBe('User logged out successfully');
    await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(401);
  });
});
