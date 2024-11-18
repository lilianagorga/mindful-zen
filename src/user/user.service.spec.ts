import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { NotFoundException } from '@nestjs/common';

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
