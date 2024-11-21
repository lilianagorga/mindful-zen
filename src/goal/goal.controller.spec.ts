import { Test, TestingModule } from '@nestjs/testing';
import { GoalController } from './goal.controller';
import { GoalService } from './goal.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Goal } from '../entities/goal.entity';
import { Repository } from 'typeorm';
import { CreateGoalDto } from './create-goal.dto';
import { Request, Response } from 'express';

describe('GoalController', () => {
  let goalController: GoalController;

  const mockGoalService = {
    findAll: jest.fn(),
    findByUserOrPublic: jest.fn(),
    findIntervalById: jest.fn(),
    findById: jest.fn(),
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

  const mockResponse = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoalController],
      providers: [
        {
          provide: GoalService,
          useValue: mockGoalService,
        },
        {
          provide: getRepositoryToken(Goal),
          useClass: Repository,
        },
      ],
    }).compile();

    goalController = module.get<GoalController>(GoalController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all goals for an admin', async () => {
    const result = [{ id: 1, name: 'Test Goal', intervalId: 1 }];
    mockGoalService.findAll.mockResolvedValue(result);

    await goalController.getAllGoals(mockAdminRequest, mockResponse);
    expect(mockGoalService.findAll).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith(result);
  });

  it('should return user-specific and public goals for a user', async () => {
    const result = [{ id: 1, name: 'Test Goal', intervalId: 1 }];
    mockGoalService.findByUserOrPublic.mockResolvedValue(result);

    await goalController.getAllGoals(mockUserRequest, mockResponse);
    expect(mockGoalService.findByUserOrPublic).toHaveBeenCalledWith(2);
    expect(mockGoalService.findByUserOrPublic).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith(result);
  });

  it('should return a goal by id', async () => {
    const goal = { id: 1, name: 'Test Goal', intervalId: 1 };
    mockGoalService.findById.mockResolvedValue(goal);

    await goalController.getGoalById('1', mockAdminRequest, mockResponse);
    expect(mockGoalService.findById).toHaveBeenCalledWith(1);
    expect(mockResponse.json).toHaveBeenCalledWith(goal);
  });

  it('should create a new goal for a user', async () => {
    const createGoalDto: CreateGoalDto = { name: 'New Goal', intervalId: 1 };
    const interval = { id: 1, userId: 2 };
    const createdGoal = { id: 1, ...createGoalDto };
    mockGoalService.findIntervalById.mockResolvedValue(interval);
    mockGoalService.create.mockResolvedValue(createdGoal);

    await goalController.createGoal(
      createGoalDto,
      mockUserRequest,
      mockResponse,
    );
    expect(mockGoalService.findIntervalById).toHaveBeenCalledWith(1);
    expect(mockGoalService.create).toHaveBeenCalledWith({
      name: 'New Goal',
      intervalId: 1,
    });
    expect(mockResponse.json).toHaveBeenCalledWith(createdGoal);
  });

  it('should update a goal', async () => {
    const updateGoalDto = { name: 'Updated Goal' };
    const updatedGoal = { id: 1, ...updateGoalDto };
    mockGoalService.update.mockResolvedValue(updatedGoal);

    await goalController.updateGoal(
      '1',
      updateGoalDto,
      mockAdminRequest,
      mockResponse,
    );
    expect(mockGoalService.update).toHaveBeenCalledWith(1, updateGoalDto);
    expect(mockResponse.json).toHaveBeenCalledWith(updatedGoal);
  });

  it('should partially update a goal', async () => {
    const partialUpdateDto = { name: 'Partially Updated Goal' };
    const updatedGoal = { id: 1, ...partialUpdateDto };
    mockGoalService.update.mockResolvedValue(updatedGoal);

    await goalController.partialUpdateGoal(
      '1',
      partialUpdateDto,
      mockAdminRequest,
      mockResponse,
    );
    expect(mockGoalService.update).toHaveBeenCalledWith(1, partialUpdateDto);
    expect(mockResponse.json).toHaveBeenCalledWith(updatedGoal);
  });

  it('should delete a goal', async () => {
    mockGoalService.delete.mockResolvedValue(undefined);

    await goalController.deleteGoal('1', mockAdminRequest, mockResponse);
    expect(mockGoalService.delete).toHaveBeenCalledWith(1);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Goal deleted successfully',
    });
  });
});
