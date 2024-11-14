import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: Record<string, jest.Mock>;

  beforeEach(async () => {
    mockUserRepository = {
      find: jest.fn() as jest.Mock<Promise<User[]>>,
      findOne: jest.fn() as jest.Mock<Promise<User | undefined>>,
      create: jest.fn() as jest.Mock<User>,
      save: jest.fn() as jest.Mock<Promise<User>>,
      update: jest.fn() as jest.Mock<Promise<{ affected: number }>>,
      delete: jest.fn() as jest.Mock<Promise<{ affected: number }>>,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all users', async () => {
    const users = [{ id: 1, email: 'test@example.com' }];
    mockUserRepository.find.mockResolvedValue(users);
    const result = await userService.findAll();
    expect(result).toEqual(users);
    expect(mockUserRepository.find).toHaveBeenCalledTimes(1);
  });

  it('should return a user by id', async () => {
    const user = { id: 1, email: 'test@example.com' };
    mockUserRepository.findOne.mockResolvedValue(user);
    const result = await userService.findById(1);
    expect(result).toEqual(user);
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should throw error when registering a user that already exists', async () => {
    const createUserDto = { email: 'test@example.com', password: 'password' };
    mockUserRepository.findOne.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
    });
    await expect(userService.register(createUserDto)).rejects.toThrow(
      ConflictException,
    );
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { email: createUserDto.email },
    });
  });

  it('should register a new user', async () => {
    const createUserDto = { email: 'new@example.com', password: 'password' };
    const savedUser = { id: 2, ...createUserDto, password: 'hashedPassword' };
    mockUserRepository.findOne.mockResolvedValue(undefined);
    mockUserRepository.create.mockReturnValue(savedUser);
    mockUserRepository.save.mockResolvedValue(savedUser);
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
    jest.spyOn(jwt, 'sign').mockReturnValue('fakeToken' as never);

    const result = await userService.register(createUserDto);

    expect(result).toEqual({
      token: 'fakeToken',
      user: { id: 2, email: 'new@example.com' },
    });
    expect(mockUserRepository.create).toHaveBeenCalledWith({
      ...createUserDto,
      password: 'hashedPassword',
    });
    expect(mockUserRepository.save).toHaveBeenCalledWith(savedUser);
  });

  it('should throw error when login fails due to invalid email', async () => {
    mockUserRepository.findOne.mockResolvedValue(undefined);
    await expect(
      userService.login('invalid@example.com', 'password'),
    ).rejects.toThrow(Error);
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { email: 'invalid@example.com' },
    });
  });

  it('should login successfully', async () => {
    const user = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
    };
    mockUserRepository.findOne.mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
    jest.spyOn(jwt, 'sign').mockReturnValue('fakeToken' as never);

    const result = await userService.login('test@example.com', 'password');
    expect(result).toEqual({
      token: 'fakeToken',
      user: { id: 1, email: 'test@example.com' },
    });
  });

  it('should update a user', async () => {
    const updatedUser = {
      id: 1,
      email: 'test@example.com',
      firstName: 'Updated',
    };
    mockUserRepository.update.mockResolvedValue({ affected: 1 });
    mockUserRepository.findOne.mockResolvedValue(updatedUser);

    const result = await userService.update(1, { firstName: 'Updated' });
    expect(result).toEqual(updatedUser);
    expect(mockUserRepository.update).toHaveBeenCalledWith(1, {
      firstName: 'Updated',
    });
  });

  it('should throw error when updating a non-existent user', async () => {
    mockUserRepository.update.mockResolvedValue({ affected: 0 });
    await expect(
      userService.update(1, { firstName: 'Updated' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should delete a user', async () => {
    mockUserRepository.delete.mockResolvedValue({ affected: 1 });
    await expect(userService.delete(1)).resolves.toBeUndefined();
    expect(mockUserRepository.delete).toHaveBeenCalledWith(1);
  });

  it('should throw error when deleting a non-existent user', async () => {
    mockUserRepository.delete.mockResolvedValue({ affected: 0 });
    await expect(userService.delete(1)).rejects.toThrow(NotFoundException);
  });
});
