import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { GoalService } from './goal.service';
import { Goal } from '../entities/goal.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('goals')
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Get()
  getAllGoals(): Promise<Goal[]> {
    return this.goalService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createGoal(@Body() createGoalDto: Partial<Goal>): Promise<Goal> {
    return this.goalService.create(createGoalDto);
  }
}
