import { Test, TestingModule } from '@nestjs/testing';
import { IntervalController } from './interval.controller';
import { IntervalService } from './interval.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Interval } from '../entities/interval.entity';
import { Repository } from 'typeorm';

describe('IntervalController', () => {
  let intervalController: IntervalController;
  let intervalService: IntervalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntervalController],
      providers: [
        IntervalService,
        {
          provide: getRepositoryToken(Interval),
          useClass: Repository,
        },
      ],
    }).compile();

    intervalController = module.get<IntervalController>(IntervalController);
    intervalService = module.get<IntervalService>(IntervalService);
  });

  it('should return all intervals', async () => {
    const result = [
      { id: 1, startDate: new Date(), endDate: new Date(), userId: 1 },
    ];
    jest
      .spyOn(intervalService, 'findAll')
      .mockResolvedValue(result as Interval[]);
    expect(await intervalController.getAllIntervals()).toBe(result);
  });
});
