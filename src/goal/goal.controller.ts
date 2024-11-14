import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { GoalService } from './goal.service';
import { Goal } from '../entities/goal.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { CreateGoalDto } from './create-goal.dto';

@Controller('goals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Get()
  getAllGoals(): Promise<Goal[]> {
    return this.goalService.findAll();
  }

  @Get(':id')
  getGoalById(@Param('id') id: string): Promise<Goal | undefined> {
    return this.goalService.findById(parseInt(id, 10));
  }

  @Post()
  @Roles('admin')
  createGoal(@Body() createGoalDto: CreateGoalDto): Promise<Goal> {
    return this.goalService.create(createGoalDto);
  }

  @Put(':id')
  @Roles('admin')
  updateGoal(
    @Param('id') id: string,
    @Body() updateGoalDto: Partial<Goal>,
  ): Promise<Goal> {
    return this.goalService.update(parseInt(id, 10), updateGoalDto);
  }

  @Patch(':id')
  @Roles('admin')
  partialUpdateGoal(
    @Param('id') id: string,
    @Body() updateGoalDto: Partial<Goal>,
  ): Promise<Goal> {
    return this.goalService.update(parseInt(id, 10), updateGoalDto);
  }

  @Delete(':id')
  @Roles('admin')
  deleteGoal(@Param('id') id: string): Promise<void> {
    return this.goalService.delete(parseInt(id, 10));
  }
}
