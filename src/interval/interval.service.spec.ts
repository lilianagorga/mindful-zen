import { Test, TestingModule } from '@nestjs/testing';
import { IntervalService } from './interval.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Interval } from '../entities/interval.entity';
import { NotFoundException } from '@nestjs/common';

describe('IntervalService', () => {
  let intervalService: IntervalService;
  let mockIntervalRepository: Record<string, jest.Mock>;

  beforeEach(async () => {
    mockIntervalRepository = {
      find: jest.fn() as jest.Mock<Promise<Interval[]>>,
      findOne: jest.fn() as jest.Mock<Promise<Interval | undefined>>,
      create: jest.fn() as jest.Mock<Interval>,
      save: jest.fn() as jest.Mock<Promise<Interval>>,
      update: jest.fn() as jest.Mock<Promise<{ affected: number }>>,
      delete: jest.fn() as jest.Mock<Promise<{ affected: number }>>,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IntervalService,
        {
          provide: getRepositoryToken(Interval),
          useValue: mockIntervalRepository,
        },
      ],
    }).compile();

    intervalService = module.get<IntervalService>(IntervalService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all intervals', async () => {
    const intervals = [{ id: 1, startDate: new Date(), endDate: new Date() }];
    mockIntervalRepository.find.mockResolvedValue(intervals);

    const result = await intervalService.findAll();
    expect(result).toEqual(intervals);
    expect(mockIntervalRepository.find).toHaveBeenCalledTimes(1);
  });

  it('should return an interval by id', async () => {
    const interval = {
      id: 1,
      startDate: new Date(),
      endDate: new Date(),
      user: { id: 1 },
    };
    mockIntervalRepository.findOne.mockResolvedValue(interval);

    const result = await intervalService.findById(1);
    expect(result).toEqual(interval);
    expect(mockIntervalRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['user'],
    });
  });

  it('should throw error when interval by id is not found', async () => {
    mockIntervalRepository.findOne.mockResolvedValue(undefined);

    await expect(intervalService.findById(1)).rejects.toThrow(
      NotFoundException,
    );
    expect(mockIntervalRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['user'],
    });
  });

  it('should create a new interval', async () => {
    const intervalData = {
      startDate: new Date(),
      endDate: new Date(),
      userId: 1,
    };
    const createdInterval = { id: 1, ...intervalData };
    mockIntervalRepository.create.mockReturnValue(createdInterval);
    mockIntervalRepository.save.mockResolvedValue(createdInterval);

    const result = await intervalService.create(intervalData);
    expect(result).toEqual(createdInterval);
    expect(mockIntervalRepository.create).toHaveBeenCalledWith(intervalData);
    expect(mockIntervalRepository.save).toHaveBeenCalledWith(createdInterval);
  });

  it('should update an interval', async () => {
    const updateData = { startDate: new Date() };
    const updatedInterval = { id: 1, ...updateData, user: { id: 1 } };
    mockIntervalRepository.update.mockResolvedValue({ affected: 1 });
    mockIntervalRepository.findOne.mockResolvedValue(updatedInterval);

    const result = await intervalService.update(1, updateData);
    expect(result).toEqual(updatedInterval);
    expect(mockIntervalRepository.update).toHaveBeenCalledWith(1, updateData);
    expect(mockIntervalRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['user'],
    });
  });

  it('should throw error when updating a non-existent interval', async () => {
    mockIntervalRepository.update.mockResolvedValue({ affected: 0 });

    await expect(
      intervalService.update(1, { startDate: new Date() }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should delete an interval', async () => {
    mockIntervalRepository.delete.mockResolvedValue({ affected: 1 });

    await expect(intervalService.delete(1)).resolves.toBeUndefined();
    expect(mockIntervalRepository.delete).toHaveBeenCalledWith(1);
  });

  it('should throw error when deleting a non-existent interval', async () => {
    mockIntervalRepository.delete.mockResolvedValue({ affected: 0 });

    await expect(intervalService.delete(1)).rejects.toThrow(NotFoundException);
  });
});
