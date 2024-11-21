import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { RolesGuard } from '../roles/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response, Request } from 'express';

jest.mock('../token-blacklist', () => ({
  tokenBlacklist: new Set<string>(),
}));

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  res.render = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn();
  return res as Response;
};

const mockRequest = (user: Partial<User> = {}) => {
  const req: Partial<Request> = {};
  req.user = user;
  return req as Request;
};

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: 'user',
  };

  beforeEach(async () => {
    const mockGuard = {
      canActivate: jest.fn(() => true),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockGuard)
      .compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    jest.spyOn(userService, 'findById').mockResolvedValue(mockUser as User);
  });

  it('should return all users', async () => {
    const result = [{ id: 1, email: 'test@example.com' }];
    jest.spyOn(userService, 'findAll').mockResolvedValue(result as User[]);
    const res = mockResponse();
    const req = mockRequest();
    await userController.getAllUsers(res, req);
    expect(res.json).toHaveBeenCalledWith(result);
  });

  it('should return a user by id', async () => {
    jest.spyOn(userService, 'findById').mockResolvedValue(mockUser as User);
    expect(await userController.getUserById('1')).toBe(mockUser);
  });

  it('should update a user', async () => {
    const updateUserDto = { firstName: 'Updated' };
    const updatedUser = { ...mockUser, ...updateUserDto };
    jest.spyOn(userService, 'update').mockResolvedValue(updatedUser as User);

    const req = mockRequest(mockUser);
    const res = mockResponse();
    await userController.updateUser('1', updateUserDto, req, res);
    expect(res.json).toHaveBeenCalledWith(updatedUser);
  });

  it('should delete a user', async () => {
    jest.spyOn(userService, 'delete').mockResolvedValue();

    const req = mockRequest(mockUser);
    const res = mockResponse();
    await userController.deleteUser('1', req, res);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User deleted successfully',
    });
  });
});
