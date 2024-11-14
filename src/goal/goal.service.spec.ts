import { Test, TestingModule } from '@nestjs/testing';
import { GoalService } from './goal.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Goal } from '../entities/goal.entity';
import { NotFoundException } from '@nestjs/common';

describe('GoalService', () => {
  let goalService: GoalService;
  let mockGoalRepository: Record<string, jest.Mock>;

  beforeEach(async () => {
    mockGoalRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoalService,
        {
          provide: getRepositoryToken(Goal),
          useValue: mockGoalRepository,
        },
      ],
    }).compile();

    goalService = module.get<GoalService>(GoalService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all goals', async () => {
    const goals = [{ id: 1, name: 'Test Goal', intervalId: 1 }];
    mockGoalRepository.find.mockResolvedValue(goals);
    const result = await goalService.findAll();
    expect(result).toEqual(goals);
    expect(mockGoalRepository.find).toHaveBeenCalledTimes(1);
  });

  it('should return a goal by id', async () => {
    const goal = { id: 1, name: 'Test Goal', intervalId: 1 };
    mockGoalRepository.findOne.mockResolvedValue(goal);
    const result = await goalService.findById(1);
    expect(result).toEqual(goal);
    expect(mockGoalRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should create a new goal', async () => {
    const goalData = { name: 'New Goal', intervalId: 1 };
    const createdGoal = { id: 1, ...goalData };
    mockGoalRepository.create.mockReturnValue(createdGoal);
    mockGoalRepository.save.mockResolvedValue(createdGoal);

    const result = await goalService.create(goalData);
    expect(result).toEqual(createdGoal);
    expect(mockGoalRepository.create).toHaveBeenCalledWith(goalData);
    expect(mockGoalRepository.save).toHaveBeenCalledWith(createdGoal);
  });

  it('should update a goal', async () => {
    const updatedGoal = { id: 1, name: 'Updated Goal', intervalId: 1 };
    mockGoalRepository.update.mockResolvedValue({ affected: 1 });
    mockGoalRepository.findOne.mockResolvedValue(updatedGoal);

    const result = await goalService.update(1, { name: 'Updated Goal' });
    expect(result).toEqual(updatedGoal);
    expect(mockGoalRepository.update).toHaveBeenCalledWith(1, {
      name: 'Updated Goal',
    });
  });

  it('should throw error when updating a non-existent goal', async () => {
    mockGoalRepository.update.mockResolvedValue({ affected: 0 });
    await expect(
      goalService.update(1, { name: 'Updated Goal' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should delete a goal', async () => {
    mockGoalRepository.delete.mockResolvedValue({ affected: 1 });
    await expect(goalService.delete(1)).resolves.toBeUndefined();
    expect(mockGoalRepository.delete).toHaveBeenCalledWith(1);
  });

  it('should throw error when deleting a non-existent goal', async () => {
    mockGoalRepository.delete.mockResolvedValue({ affected: 0 });
    await expect(goalService.delete(1)).rejects.toThrow(NotFoundException);
  });
});
