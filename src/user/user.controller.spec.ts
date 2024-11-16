import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { RolesGuard } from '../roles/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  res.render = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn().mockReturnValue(res);
  return res as Response;
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
  });

  it('should return all users', async () => {
    const result = [{ id: 1, email: 'test@example.com' }];
    jest.spyOn(userService, 'findAll').mockResolvedValue(result as User[]);
    const res = mockResponse();
    await userController.getAllUsers(res);
    expect(res.json).toHaveBeenCalledWith(result);
  });

  it('should return a user by id', async () => {
    jest.spyOn(userService, 'findById').mockResolvedValue(mockUser as User);
    expect(await userController.getUserById('1')).toBe(mockUser);
  });

  it('should create a new user', async () => {
    const createUserDto = {
      email: 'new@example.com',
      password: 'password123',
      firstName: 'New',
      lastName: 'User',
    };
    const createdUser = { ...mockUser, id: 2, ...createUserDto };
    jest
      .spyOn(userService, 'register')
      .mockResolvedValue({ token: 'fakeToken', user: createdUser });
    const res = mockResponse(); // Passa il mock `Response`
    await userController.registerUser(createUserDto, res);
    expect(res.json).toHaveBeenCalledWith({
      token: 'fakeToken',
      user: createdUser,
    });
  });

  it('should update a user', async () => {
    const updateUserDto = { firstName: 'Updated' };
    const updatedUser = { ...mockUser, ...updateUserDto };
    jest.spyOn(userService, 'update').mockResolvedValue(updatedUser as User);
    expect(await userController.updateUser('1', updateUserDto)).toBe(
      updatedUser,
    );
  });

  it('should delete a user', async () => {
    jest.spyOn(userService, 'delete').mockResolvedValue();
    await expect(userController.deleteUser('1')).resolves.toBeUndefined();
  });
});
