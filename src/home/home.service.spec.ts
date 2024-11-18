import { Test, TestingModule } from '@nestjs/testing';
import { HomeService } from './home.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConflictException } from '@nestjs/common';

describe('HomeService', () => {
  let homeService: HomeService;
  let mockUserRepository: Record<string, jest.Mock>;

  beforeEach(async () => {
    mockUserRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HomeService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    homeService = module.get<HomeService>(HomeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error when registering a user that already exists', async () => {
    const createUserDto = { email: 'test@example.com', password: 'password' };
    mockUserRepository.findOne.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
    });
    await expect(homeService.register(createUserDto)).rejects.toThrow(
      ConflictException,
    );
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { email: createUserDto.email },
    });
  });

  it('should register a new user', async () => {
    const createUserDto = { email: 'new@example.com', password: 'password' };
    const savedUser = {
      id: 2,
      ...createUserDto,
      password: 'hashedPassword',
      role: 'user',
    };
    mockUserRepository.findOne.mockResolvedValue(undefined);
    mockUserRepository.create.mockReturnValue(savedUser);
    mockUserRepository.save.mockResolvedValue(savedUser);
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
    jest.spyOn(jwt, 'sign').mockReturnValue('fakeToken' as never);

    const result = await homeService.register(createUserDto);
    expect(result).toEqual({
      token: 'fakeToken',
      user: { id: 2, email: 'new@example.com', role: 'user' },
    });
    expect(mockUserRepository.create).toHaveBeenCalledWith({
      ...createUserDto,
      password: 'hashedPassword',
      role: 'user',
    });
    expect(mockUserRepository.save).toHaveBeenCalledWith(savedUser);
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

    const result = await homeService.login('test@example.com', 'password');
    expect(result).toEqual({
      token: 'fakeToken',
      user: { id: 1, email: 'test@example.com' },
    });
  });

  it('should throw error on invalid email or password', async () => {
    mockUserRepository.findOne.mockResolvedValue(undefined);
    await expect(
      homeService.login('invalid@example.com', 'password'),
    ).rejects.toThrow(Error);
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { email: 'invalid@example.com' },
    });
  });
});
