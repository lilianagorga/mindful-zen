import { Controller, Get, Post, Body } from '@nestjs/common';
import { GoalService } from './goal.service';
import { Goal } from './entities/goal.entity';

@Controller('goals')
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Get()
  getAllGoals(): Promise<Goal[]> {
    return this.goalService.findAll();
  }

  @Post()
  createGoal(@Body() createGoalDto: Partial<Goal>): Promise<Goal> {
    return this.goalService.create(createGoalDto);
  }
}
