import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from './entities/goal.entity';

@Injectable()
export class GoalService {
  constructor(
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>,
  ) {}

  findAll(): Promise<Goal[]> {
    return this.goalRepository.find();
  }

  create(goalData: Partial<Goal>): Promise<Goal> {
    const goal = this.goalRepository.create(goalData);
    return this.goalRepository.save(goal);
  }
}
