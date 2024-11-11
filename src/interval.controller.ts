import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { IntervalService } from './interval.service';
import { Interval } from './entities/interval.entity';

@Controller('intervals')
export class IntervalController {
  constructor(private readonly intervalService: IntervalService) {}

  @Get()
  getAllIntervals(): Promise<Interval[]> {
    return this.intervalService.findAll();
  }

  @Get(':id')
  getIntervalById(@Param('id') id: string): Promise<Interval | undefined> {
    return this.intervalService.findById(parseInt(id, 10));
  }

  @Post()
  createInterval(
    @Body() createIntervalDto: Partial<Interval>,
  ): Promise<Interval> {
    return this.intervalService.create(createIntervalDto);
  }
}
