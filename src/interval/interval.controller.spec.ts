import { Test, TestingModule } from '@nestjs/testing';
import { IntervalController } from './interval.controller';
import { IntervalService } from './interval.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Interval } from '../entities/interval.entity';
import { Repository } from 'typeorm';
import { CreateIntervalDto } from './create-interval.dto';

describe('IntervalController', () => {
  let intervalController: IntervalController;

  const mockIntervalService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntervalController],
      providers: [
        {
          provide: IntervalService,
          useValue: mockIntervalService,
        },
        {
          provide: getRepositoryToken(Interval),
          useClass: Repository,
        },
      ],
    }).compile();

    intervalController = module.get<IntervalController>(IntervalController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all intervals', async () => {
    const result = [
      { id: 1, startDate: new Date(), endDate: new Date(), userId: 1 },
    ];
    mockIntervalService.findAll.mockResolvedValue(result);
    expect(await intervalController.getAllIntervals()).toBe(result);
    expect(mockIntervalService.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return an interval by id', async () => {
    const interval = { id: 1, startDate: new Date(), endDate: new Date() };
    mockIntervalService.findById.mockResolvedValue(interval);
    expect(await intervalController.getIntervalById('1')).toBe(interval);
    expect(mockIntervalService.findById).toHaveBeenCalledWith(1);
  });

  it('should create a new interval', async () => {
    const createIntervalDto: CreateIntervalDto = {
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      userId: 1,
    };
    const createdInterval = { id: 1, ...createIntervalDto };
    mockIntervalService.create.mockResolvedValue(createdInterval);

    const result = await intervalController.createInterval(createIntervalDto);
    expect(result).toBe(createdInterval);
    expect(mockIntervalService.create).toHaveBeenCalledWith({
      ...createIntervalDto,
      startDate: new Date(createIntervalDto.startDate),
      endDate: new Date(createIntervalDto.endDate),
    });
  });

  it('should update an interval', async () => {
    const updateIntervalDto = { startDate: new Date() };
    const updatedInterval = { id: 1, ...updateIntervalDto };
    mockIntervalService.update.mockResolvedValue(updatedInterval);

    const result = await intervalController.updateInterval(
      '1',
      updateIntervalDto,
    );
    expect(result).toBe(updatedInterval);
    expect(mockIntervalService.update).toHaveBeenCalledWith(
      1,
      updateIntervalDto,
    );
  });

  it('should partially update an interval', async () => {
    const partialUpdateDto = { endDate: new Date() };
    const updatedInterval = { id: 1, ...partialUpdateDto };
    mockIntervalService.update.mockResolvedValue(updatedInterval);

    const result = await intervalController.partialUpdateInterval(
      '1',
      partialUpdateDto,
    );
    expect(result).toBe(updatedInterval);
    expect(mockIntervalService.update).toHaveBeenCalledWith(
      1,
      partialUpdateDto,
    );
  });

  it('should delete an interval', async () => {
    mockIntervalService.delete.mockResolvedValue(undefined);
    await expect(
      intervalController.deleteInterval('1'),
    ).resolves.toBeUndefined();
    expect(mockIntervalService.delete).toHaveBeenCalledWith(1);
  });
});
