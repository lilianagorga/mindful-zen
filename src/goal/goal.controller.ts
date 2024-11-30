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
  Req,
  Res,
} from '@nestjs/common';
import { GoalService } from './goal.service';
import { Goal } from '../entities/goal.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { CreateGoalDto } from './create-goal.dto';
import { Request, Response } from 'express';

@Controller('goals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Get()
  @Roles('admin', 'user')
  async getAllGoals(@Req() req: Request, @Res() res: Response): Promise<any> {
    const goals =
      req.user.role === 'admin'
        ? await this.goalService.findAll()
        : await this.goalService.findByUserOrPublic(req.user.id);

    return res.json(goals);
  }

  @Get(':id')
  @Roles('admin', 'user')
  async getGoalById(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    const goal = await this.goalService.findById(parseInt(id, 10));
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    if (req.user.role !== 'admin' && goal.interval.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    return res.json(goal);
  }

  @Post()
  @Roles('admin', 'user')
  async createGoal(
    @Body() createGoalDto: CreateGoalDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    const { name, intervalId } = createGoalDto;
    const interval = await this.goalService.findIntervalById(intervalId);
    if (!interval) {
      return res.status(404).json({ message: 'Interval not found' });
    }
    if (req.user.role !== 'admin' && interval.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied to the interval' });
    }
    const goalData = {
      name,
      intervalId,
    };
    const newGoal = await this.goalService.create(goalData);
    return res.json(newGoal);
  }

  @Put(':id')
  @Roles('admin', 'user')
  async updateGoal(
    @Param('id') id: string,
    @Body() updateGoalDto: Partial<Goal>,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    const goal = await this.goalService.findById(parseInt(id, 10));
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    if (req.user.role !== 'admin' && goal.interval.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!updateGoalDto.name || !updateGoalDto.intervalId) {
      return res
        .status(400)
        .json({ message: 'Missing required fields for full update' });
    }

    const updatedGoal = await this.goalService.update(
      parseInt(id, 10),
      updateGoalDto,
    );

    return res.json(updatedGoal);
  }

  @Patch(':id')
  @Roles('admin', 'user')
  async partialUpdateGoal(
    @Param('id') id: string,
    @Body() updateGoalDto: Partial<Goal>,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    const goal = await this.goalService.findById(parseInt(id, 10));
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    if (req.user.role !== 'admin' && goal.interval.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedGoal = await this.goalService.update(
      parseInt(id, 10),
      updateGoalDto,
    );
    return res.json(updatedGoal);
  }

  @Delete(':id')
  @Roles('admin', 'user')
  async deleteGoal(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    const goal = await this.goalService.findById(parseInt(id, 10));
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    if (req.user.role !== 'admin' && goal.interval.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await this.goalService.delete(parseInt(id, 10));
    return res.json({ message: 'Goal deleted successfully' });
  }
}
