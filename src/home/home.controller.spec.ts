import { Test, TestingModule } from '@nestjs/testing';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Response, Request } from 'express';
import { tokenBlacklist } from '../token-blacklist';

jest.mock('../token-blacklist', () => ({
  tokenBlacklist: new Set<string>(),
}));

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.json = jest.fn().mockReturnValue(res);
  res.render = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn();
  res.clearCookie = jest.fn();
  return res as Response;
};

const mockRequest = (overrides = {}) => {
  const req: Partial<Request> = {
    cookies: {},
    headers: { 'user-agent': 'Test-Agent' },
    ...overrides,
  };
  return req as Request;
};

describe('HomeController', () => {
  let homeController: HomeController;
  let homeService: HomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeController],
      providers: [
        HomeService,
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
      ],
    }).compile();

    homeController = module.get<HomeController>(HomeController);
    homeService = module.get<HomeService>(HomeService);
  });

  it('should be defined', () => {
    expect(homeController).toBeDefined();
  });

  it('should return a welcome message', () => {
    const result = 'Welcome to the Mindful Zen API!';
    jest
      .spyOn(homeService, 'getWelcomeMessage')
      .mockImplementation(() => result);

    const res = {
      json: jest.fn(),
      req: {
        headers: {
          accept: 'application/json',
        },
      },
    };
    const req = mockRequest();

    homeController.getHomePage(res as any, req as any);

    expect(res.json).toHaveBeenCalledWith({ message: result });
  });

  it('should register a new user', async () => {
    const createUserDto = {
      email: 'new@example.com',
      password: 'password123',
      firstName: 'New',
      lastName: 'User',
    };
    const createdUser = { id: 2, ...createUserDto };
    jest.spyOn(homeService, 'register').mockResolvedValue({
      token: 'fakeToken',
      user: createdUser,
    });

    const res = mockResponse();
    const req = mockRequest();
    await homeController.registerUser(createUserDto, res, req);

    expect(res.json).toHaveBeenCalledWith({
      token: 'fakeToken',
      user: createdUser,
    });
  });

  it('should login a user', async () => {
    const loginDto = { email: 'test@example.com', password: 'password123' };
    const user = { id: 1, email: 'test@example.com' };
    jest.spyOn(homeService, 'login').mockResolvedValue({
      token: 'fakeToken',
      user,
    });
    const res = mockResponse();
    const req = mockRequest();
    await homeController.loginUser(loginDto, res, req);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Login successful',
      token: 'fakeToken',
    });
  });

  it('should logout a user and clear the cookie', async () => {
    const res = mockResponse();
    const req = mockRequest({
      cookies: { jwt: 'fakeToken' },
      headers: { 'user-agent': 'Test-Agent' },
    });

    await homeController.logoutUser(res, req);

    expect(res.clearCookie).toHaveBeenCalledWith('jwt', { httpOnly: true });
    expect(res.json).toHaveBeenCalledWith({
      message: 'User logged out successfully',
    });
    expect(tokenBlacklist.has('fakeToken')).toBe(true);
  });
});
