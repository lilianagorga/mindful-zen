import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from '../entities/goal.entity';
import { IntervalService } from '../interval/interval.service';

@Injectable()
export class GoalService {
  constructor(
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>,
    private readonly intervalService: IntervalService,
  ) {}

  async findIntervalById(intervalId: number) {
    return this.intervalService.findById(intervalId);
  }

  findAll(): Promise<Goal[]> {
    return this.goalRepository.find({
      relations: ['interval', 'interval.user'],
    });
  }

  findByUserOrPublic(userId: number): Promise<Goal[]> {
    return this.goalRepository.find({
      where: [{ interval: { userId } }, { interval: { userId: null } }],
      relations: ['interval'],
    });
  }

  findById(id: number): Promise<Goal | undefined> {
    return this.goalRepository.findOne({
      where: { id },
      relations: ['interval'],
    });
  }

  async create(goalData: Partial<Goal>): Promise<Goal> {
    const { intervalId } = goalData;
    const interval = await this.findIntervalById(intervalId);
    if (!interval) {
      throw new NotFoundException(`Interval with ID ${intervalId} not found`);
    }
    const goal = this.goalRepository.create(goalData);
    return this.goalRepository.save(goal);
  }

  async update(id: number, updateData: Partial<Goal>): Promise<Goal> {
    await this.goalRepository.update(id, updateData);
    const updatedGoal = await this.goalRepository.findOne({
      where: { id },
      relations: ['interval'],
    });
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
