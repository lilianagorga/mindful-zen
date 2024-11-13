import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { IntervalService } from './interval.service';
import { Interval } from '../entities/interval.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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
  @UseGuards(JwtAuthGuard)
  createInterval(
    @Body() createIntervalDto: Partial<Interval>,
  ): Promise<Interval> {
    try {
      return this.intervalService.create(createIntervalDto);
    } catch (error) {
      throw error;
    }
  }
}
