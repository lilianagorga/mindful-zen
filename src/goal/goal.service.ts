import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from '../entities/goal.entity';

@Injectable()
export class GoalService {
  constructor(
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>,
  ) {}

  findAll(): Promise<Goal[]> {
    return this.goalRepository.find();
  }

  findById(id: number): Promise<Goal | undefined> {
    return this.goalRepository.findOne({ where: { id } });
  }

  create(goalData: Partial<Goal>): Promise<Goal> {
    const goal = this.goalRepository.create(goalData);
    return this.goalRepository.save(goal);
  }

  async update(id: number, updateData: Partial<Goal>): Promise<Goal> {
    await this.goalRepository.update(id, updateData);
    const updatedGoal = await this.goalRepository.findOne({ where: { id } });
    if (!updatedGoal) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }
    return updatedGoal;
  }

  async delete(id: number): Promise<void> {
    const result = await this.goalRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }
  }
}
