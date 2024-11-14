import { Test, TestingModule } from '@nestjs/testing';
import { GoalController } from './goal.controller';
import { GoalService } from './goal.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Goal } from '../entities/goal.entity';
import { Repository } from 'typeorm';
import { CreateGoalDto } from './create-goal.dto';

describe('GoalController', () => {
  let goalController: GoalController;

  const mockGoalService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

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

  it('should return all goals', async () => {
    const result = [{ id: 1, name: 'Test Goal', intervalId: 1 }];
    mockGoalService.findAll.mockResolvedValue(result);
    expect(await goalController.getAllGoals()).toBe(result);
    expect(mockGoalService.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return a goal by id', async () => {
    const goal = { id: 1, name: 'Test Goal', intervalId: 1 };
    mockGoalService.findById.mockResolvedValue(goal);
    expect(await goalController.getGoalById('1')).toBe(goal);
    expect(mockGoalService.findById).toHaveBeenCalledWith(1);
  });

  it('should create a new goal', async () => {
    const createGoalDto: CreateGoalDto = { name: 'New Goal', intervalId: 1 };
    const createdGoal = { id: 1, ...createGoalDto };
    mockGoalService.create.mockResolvedValue(createdGoal);

    const result = await goalController.createGoal(createGoalDto);
    expect(result).toBe(createdGoal);
    expect(mockGoalService.create).toHaveBeenCalledWith(createGoalDto);
  });

  it('should update a goal', async () => {
    const updateGoalDto = { name: 'Updated Goal' };
    const updatedGoal = { id: 1, ...updateGoalDto };
    mockGoalService.update.mockResolvedValue(updatedGoal);

    const result = await goalController.updateGoal('1', updateGoalDto);
    expect(result).toBe(updatedGoal);
    expect(mockGoalService.update).toHaveBeenCalledWith(1, updateGoalDto);
  });

  it('should partially update a goal', async () => {
    const partialUpdateDto = { name: 'Partially Updated Goal' };
    const updatedGoal = { id: 1, ...partialUpdateDto };
    mockGoalService.update.mockResolvedValue(updatedGoal);

    const result = await goalController.partialUpdateGoal(
      '1',
      partialUpdateDto,
    );
    expect(result).toBe(updatedGoal);
    expect(mockGoalService.update).toHaveBeenCalledWith(1, partialUpdateDto);
  });

  it('should delete a goal', async () => {
    mockGoalService.delete.mockResolvedValue(undefined);
    await expect(goalController.deleteGoal('1')).resolves.toBeUndefined();
    expect(mockGoalService.delete).toHaveBeenCalledWith(1);
  });
});
