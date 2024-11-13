import { Test, TestingModule } from '@nestjs/testing';
import { GoalController } from './goal.controller';
import { GoalService } from './goal.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Goal } from '../entities/goal.entity';
import { Repository } from 'typeorm';

describe('GoalController', () => {
  let goalController: GoalController;
  let goalService: GoalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoalController],
      providers: [
        GoalService,
        {
          provide: getRepositoryToken(Goal),
          useClass: Repository,
        },
      ],
    }).compile();

    goalController = module.get<GoalController>(GoalController);
    goalService = module.get<GoalService>(GoalService);
  });

  it('should return all goals', async () => {
    const result = [{ id: 1, name: 'Test Goal', intervalId: 1 }];
    jest.spyOn(goalService, 'findAll').mockResolvedValue(result as Goal[]);
    expect(await goalController.getAllGoals()).toBe(result);
  });
});
