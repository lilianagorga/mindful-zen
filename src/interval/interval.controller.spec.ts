import { Test, TestingModule } from '@nestjs/testing';
import { IntervalController } from './interval.controller';
import { IntervalService } from './interval.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Interval } from '../entities/interval.entity';
import { Repository } from 'typeorm';
import { CreateIntervalDto } from './create-interval.dto';
import { Request, Response } from 'express';

describe('IntervalController', () => {
  let intervalController: IntervalController;

  const mockIntervalService = {
    findAll: jest.fn(),
    findByUserOrPublic: jest.fn(),
    findById: jest.fn(),
    filterIntervals: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockAdminRequest = {
    user: {
      id: 1,
      role: 'admin',
    },
  } as unknown as Request;

  const mockUserRequest = {
    user: {
      id: 2,
      role: 'user',
    },
  } as unknown as Request;

  const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
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

  it('should return all intervals for admin', async () => {
    const result = [
      { id: 1, startDate: new Date(), endDate: new Date(), userId: 1 },
    ];
    mockIntervalService.filterIntervals.mockResolvedValue(result);

    const res = mockResponse();

    const mockAdminRequestWithQuery = {
      ...mockAdminRequest,
      query: {},
    } as unknown as Request;

    await intervalController.getAllIntervals(mockAdminRequestWithQuery, res);
    expect(mockIntervalService.filterIntervals).toHaveBeenCalledWith({
      startDate: undefined,
      endDate: undefined,
      goalName: undefined,
      isAdmin: true,
      userId: 1,
    });
    expect(res.json).toHaveBeenCalledWith(result);
  });

  it('should return intervals for a user (their own and public)', async () => {
    const result = [
      { id: 2, startDate: new Date(), endDate: new Date(), userId: 2 },
      { id: 3, startDate: new Date(), endDate: new Date(), userId: null },
    ];
    mockIntervalService.filterIntervals.mockResolvedValue(result);

    const res = mockResponse();

    const mockUserRequestWithQuery = {
      ...mockUserRequest,
      query: {},
    } as unknown as Request;

    await intervalController.getAllIntervals(mockUserRequestWithQuery, res);

    expect(mockIntervalService.filterIntervals).toHaveBeenCalledWith({
      startDate: undefined,
      endDate: undefined,
      goalName: undefined,
      isAdmin: false,
      userId: 2,
    });
    expect(res.json).toHaveBeenCalledWith(result);
  });

  it('should return an interval by id for admin', async () => {
    const interval = { id: 1, startDate: new Date(), endDate: new Date() };
    mockIntervalService.findById.mockResolvedValue(interval);

    const res = mockResponse();
    await intervalController.getIntervalById('1', mockAdminRequest, res);

    expect(mockIntervalService.findById).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(interval);
  });

  it('should return an interval by id for user if owned or public', async () => {
    const interval = {
      id: 2,
      startDate: new Date(),
      endDate: new Date(),
      userId: 2,
    };
    mockIntervalService.findById.mockResolvedValue(interval);

    const res = mockResponse();
    await intervalController.getIntervalById('2', mockUserRequest, res);

    expect(mockIntervalService.findById).toHaveBeenCalledWith(2);
    expect(res.json).toHaveBeenCalledWith(interval);
  });

  it('should throw ForbiddenException if user tries to access an interval not owned by them', async () => {
    const interval = {
      id: 3,
      startDate: new Date(),
      endDate: new Date(),
      userId: 3, // Non appartiene all'utente della richiesta
    };
    mockIntervalService.findById.mockResolvedValue(interval);

    const res = mockResponse();
    await intervalController.getIntervalById('3', mockUserRequest, res);

    // Verifica che il servizio sia stato chiamato correttamente
    expect(mockIntervalService.findById).toHaveBeenCalledWith(3);

    // Controllo accesso negato
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Access denied' });
  });

  it('should create a new interval for a user', async () => {
    const createIntervalDto: CreateIntervalDto = {
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    };
    const createdInterval = { id: 1, ...createIntervalDto, userId: 2 };
    mockIntervalService.create.mockResolvedValue(createdInterval);

    const res = mockResponse();
    await intervalController.createInterval(
      createIntervalDto,
      mockUserRequest,
      res,
    );

    expect(mockIntervalService.create).toHaveBeenCalledWith({
      ...createIntervalDto,
      userId: 2,
      startDate: new Date(createIntervalDto.startDate),
      endDate: new Date(createIntervalDto.endDate),
    });
    expect(res.json).toHaveBeenCalledWith(createdInterval);
  });

  it('should update an interval if user is owner or admin', async () => {
    const updateIntervalDto = { startDate: new Date() };
    const interval = { id: 1, userId: 2 }; // L'intervallo appartiene all'utente
    const updatedInterval = { id: 1, ...updateIntervalDto, userId: 2 };
    mockIntervalService.findById.mockResolvedValue(interval);
    mockIntervalService.update.mockResolvedValue(updatedInterval);

    const res = mockResponse();
    await intervalController.updateInterval(
      '1',
      updateIntervalDto,
      mockUserRequest,
      res,
    );

    expect(mockIntervalService.update).toHaveBeenCalledWith(1, {
      ...updateIntervalDto,
      userId: 2,
    });
    expect(res.json).toHaveBeenCalledWith(updatedInterval);
  });

  it('should throw ForbiddenException if user tries to update an interval not owned by them', async () => {
    const updateIntervalDto = { startDate: new Date() };

    const interval = {
      id: 1,
      startDate: new Date(),
      endDate: new Date(),
      userId: 3, // Non appartiene all'utente della richiesta
    };
    mockIntervalService.findById.mockResolvedValue(interval);

    const res = mockResponse();
    await intervalController.updateInterval(
      '1',
      updateIntervalDto,
      mockUserRequest,
      res,
    );

    expect(mockIntervalService.findById).toHaveBeenCalledWith(1);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Access denied' });
  });

  it('should delete an interval if user is owner or admin', async () => {
    const interval = { id: 1, userId: 2 };
    mockIntervalService.findById.mockResolvedValue(interval);
    mockIntervalService.delete.mockResolvedValue(undefined);

    const res = mockResponse();
    await intervalController.deleteInterval('1', mockUserRequest, res);

    expect(mockIntervalService.delete).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Interval deleted successfully',
    });
  });

  it('should throw ForbiddenException if user tries to delete an interval not owned by them', async () => {
    const interval = {
      id: 1,
      startDate: new Date(),
      endDate: new Date(),
      userId: 3,
    };
    mockIntervalService.findById.mockResolvedValue(interval);

    const res = mockResponse();
    await intervalController.deleteInterval('1', mockUserRequest, res);

    expect(mockIntervalService.findById).toHaveBeenCalledWith(1);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Access denied' });
  });
});
