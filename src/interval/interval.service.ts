import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interval } from '../entities/interval.entity';

@Injectable()
export class IntervalService {
  constructor(
    @InjectRepository(Interval)
    private readonly intervalRepository: Repository<Interval>,
  ) {}

  findAll(): Promise<Interval[]> {
    return this.intervalRepository.find();
  }

  findByUserOrPublic(userId: number): Promise<Interval[]> {
    return this.intervalRepository.find({
      where: [{ userId }, { userId: null }],
    });
  }

  findById(id: number): Promise<Interval> {
    return this.intervalRepository
      .findOne({
        where: { id },
        relations: ['user'],
      })
      .then((interval) => {
        if (!interval) {
          throw new NotFoundException(`Interval with ID ${id} not found`);
        }
        return interval;
      });
  }

  async findAllWithUsers(): Promise<Interval[]> {
    return this.intervalRepository.find({ relations: ['user'] });
  }

  create(intervalData: Partial<Interval>): Promise<Interval> {
    const interval = this.intervalRepository.create(intervalData);
    return this.intervalRepository.save(interval);
  }

  async update(id: number, updateData: Partial<Interval>): Promise<Interval> {
    await this.intervalRepository.update(id, updateData);
    const updatedInterval = await this.intervalRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!updatedInterval) {
      throw new NotFoundException(`Interval with ID ${id} not found`);
    }
    return updatedInterval;
  }

  async delete(id: number): Promise<void> {
    const result = await this.intervalRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Interval with ID ${id} not found`);
    }
  }

  async filterIntervals(filters: {
    goalName?: string;
    startDate?: string;
    endDate?: string;
    isAdmin: boolean;
    userId?: number;
  }): Promise<Interval[]> {
    const intervals = filters.isAdmin
      ? await this.findAll()
      : await this.findByUserOrPublic(filters.userId);

    const filteredIntervals = intervals.filter((interval) => {
      if (!filters.isAdmin) {
        const isPublic = !interval.userId;
        const isUserInterval = interval.userId === filters.userId;
        if (!isPublic && !isUserInterval) {
          return false;
        }
      }

      if (filters.goalName) {
        const matchesGoalName = interval.goals.some(
          (goal) => goal.name === filters.goalName,
        );
        if (!matchesGoalName) {
          return false;
        }
      }
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        if (interval.startDate < startDate) {
          return false;
        }
      }
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        if (interval.endDate > endDate) {
          return false;
        }
      }
      return true;
    });
    return filteredIntervals;
  }
}
