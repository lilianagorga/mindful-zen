import {
  Controller,
  Get,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  Res,
  ForbiddenException,
  Post,
} from '@nestjs/common';
import { UserService } from './user/user.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './roles/roles.guard';
import { Roles } from './roles/roles.decorator';
import { Request, Response } from 'express';
import { User } from './entities/user.entity';
import { Interval } from './entities/interval.entity';
import { IntervalService } from './interval/interval.service';
import { Goal } from './entities/goal.entity';
import { GoalService } from './goal/goal.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(
    private readonly userService: UserService,
    private readonly intervalService: IntervalService,
    private readonly goalService: GoalService,
  ) {}

  @Get()
  @Roles('admin')
  async getDashboard(@Res() res: Response, @Req() req: Request) {
    const users = await this.userService.findAll();
    const intervals = await this.intervalService.findAllWithUsers();
    const goals = await this.goalService.findAll();
    const currentUser = req.user;
    return res.render('dashboard', { users, intervals, goals, currentUser });
  }

  @Put(':id')
  @Roles('admin')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<User>,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = await this.userService.findById(parseInt(id, 10));
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const updatedUser = await this.userService.update(
      parseInt(id, 10),
      updateUserDto,
    );
    return res.json(updatedUser);
  }

  @Delete(':id')
  @Roles('admin')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    await this.userService.delete(parseInt(id, 10));
    return res.json({ message: 'User deleted successfully' });
  }

  @Post('intervals')
  @Roles('admin')
  async createInterval(
    @Body() createIntervalDto: Partial<Interval>,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const intervalData = {
      ...createIntervalDto,
      userId: createIntervalDto.userId,
      startDate: new Date(createIntervalDto.startDate),
      endDate: new Date(createIntervalDto.endDate),
    };

    const newInterval = await this.intervalService.create(intervalData);
    return res.status(201).json(newInterval);
  }

  @Put('intervals/:id')
  @Roles('admin')
  async updateInterval(
    @Param('id') id: string,
    @Body() updateIntervalDto: Partial<Interval>,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const interval = await this.intervalService.findById(parseInt(id, 10));
    if (!interval) {
      throw new ForbiddenException('Interval not found');
    }

    const updatedInterval = await this.intervalService.update(
      parseInt(id, 10),
      updateIntervalDto,
    );

    return res.json(updatedInterval);
  }

  @Patch('intervals/:id')
  @Roles('admin')
  async partialUpdateInterval(
    @Param('id') id: string,
    @Body() updateIntervalDto: Partial<Interval>,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const interval = await this.intervalService.findById(parseInt(id, 10));
    if (!interval) {
      throw new ForbiddenException('Interval not found');
    }

    const updatedInterval = await this.intervalService.update(
      parseInt(id, 10),
      updateIntervalDto,
    );
    return res.json(updatedInterval);
  }

  @Delete('intervals/:id')
  @Roles('admin')
  async deleteInterval(@Param('id') id: string, @Res() res: Response) {
    await this.intervalService.delete(parseInt(id, 10));
    return res.json({ message: 'Interval deleted successfully' });
  }

  @Post('goals')
  @Roles('admin')
  async createGoal(@Body() createGoalDto: Partial<Goal>, @Res() res: Response) {
    const { intervalId, name } = createGoalDto;
    const interval = await this.intervalService.findById(intervalId);
    if (!interval) {
      return res.status(404).json({ message: 'Interval not found' });
    }

    const goalData = {
      name,
      intervalId,
    };

    const newGoal = await this.goalService.create(goalData);
    return res.status(201).json(newGoal);
  }
  @Put('goals/:id')
  @Roles('admin')
  async updateGoal(
    @Param('id') id: string,
    @Body() updateGoalDto: Partial<Goal>,
    @Res() res: Response,
  ) {
    const goal = await this.goalService.findById(parseInt(id, 10));
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    const updatedGoal = await this.goalService.update(
      parseInt(id, 10),
      updateGoalDto,
    );
    return res.json(updatedGoal);
  }
  @Delete('goals/:id')
  @Roles('admin')
  async deleteGoal(@Param('id') id: string, @Res() res: Response) {
    const goal = await this.goalService.findById(parseInt(id, 10));
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    await this.goalService.delete(parseInt(id, 10));
    return res.json({ message: 'Goal deleted successfully' });
  }
}
