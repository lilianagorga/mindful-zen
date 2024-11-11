import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interval } from './entities/interval.entity';

@Injectable()
export class IntervalService {
  constructor(
    @InjectRepository(Interval)
    private readonly intervalRepository: Repository<Interval>,
  ) {}

  findAll(): Promise<Interval[]> {
    return this.intervalRepository.find();
  }

  findById(id: number): Promise<Interval | undefined> {
    return this.intervalRepository.findOne({ where: { id } });
  }

  create(intervalData: Partial<Interval>): Promise<Interval> {
    const interval = this.intervalRepository.create(intervalData);
    return this.intervalRepository.save(interval);
  }
}
