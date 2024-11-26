import {
  Controller,
  Get,
  Put,
  Patch,
  Delete,
  Body,
  UseGuards,
  Req,
  Res,
  ForbiddenException,
  Param,
  Post,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { IntervalService } from '../interval/interval.service';
import { GoalService } from '../goal/goal.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { Request, Response } from 'express';
import { User } from '../entities/user.entity';
import { Interval } from '../entities/interval.entity';
import { Goal } from '../entities/goal.entity';

@Controller('profile')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProfileController {
  constructor(
    private readonly userService: UserService,
    private readonly intervalService: IntervalService,
    private readonly goalService: GoalService,
  ) {}

  @Get()
  @Roles('admin', 'user')
  async getProfile(@Res() res: Response, @Req() req: Request) {
    const currentUser = req.user;
    if (!currentUser) {
      throw new ForbiddenException('User not authenticated');
    }
    const user = await this.userService.findById(currentUser.id);
    const intervals = await this.intervalService.findByUserOrPublic(
      currentUser.id,
    );
    const goals = await this.goalService.findByUserOrPublic(currentUser.id);
    return res.render('profile', { user, intervals, goals, currentUser });
  }

  @Put()
  @Roles('admin', 'user')
  async updateProfile(
    @Body() updateUserDto: Partial<User>,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const currentUser = req.user;
    if (!currentUser) {
      throw new ForbiddenException('User not authenticated');
    }
    const updatedUser = await this.userService.update(
      currentUser.id,
      updateUserDto,
    );
    return res.json({ message: 'Profile updated successfully', updatedUser });
  }

  @Patch()
  @Roles('admin', 'user')
  async partialUpdateProfile(
    @Body() updateUserDto: Partial<User>,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const currentUser = req.user;
    if (!currentUser) {
      throw new ForbiddenException('User not authenticated');
    }
    const updatedUser = await this.userService.update(
      currentUser.id,
      updateUserDto,
    );
    return res.json({
      message: 'Profile partially updated successfully',
      updatedUser,
    });
  }

  @Delete()
  @Roles('admin', 'user')
  async deleteProfile(@Req() req: Request, @Res() res: Response) {
    const currentUser = req.user;
    if (!currentUser) {
      throw new ForbiddenException('User not authenticated');
    }
    await this.userService.delete(currentUser.id);
    return res.json({ message: 'Profile deleted successfully' });
  }

  @Post('intervals')
  @Roles('admin', 'user')
  async createInterval(
    @Body() createIntervalDto: Partial<Interval>,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const currentUser = req.user;
    if (!currentUser) {
      throw new ForbiddenException('User not authenticated');
    }

    const intervalData = {
      ...createIntervalDto,
      userId: currentUser.id,
      startDate: new Date(createIntervalDto.startDate),
      endDate: new Date(createIntervalDto.endDate),
    };

    const newInterval = await this.intervalService.create(intervalData);
    return res.status(201).json(newInterval);
  }

  @Put('intervals/:id')
  @Roles('admin', 'user')
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
    if (interval.userId !== req.user.id) {
      throw new ForbiddenException('Access denied');
    }

    const updatedInterval = await this.intervalService.update(
      parseInt(id, 10),
      updateIntervalDto,
    );
    return res.json(updatedInterval);
  }

  @Patch('intervals/:id')
  @Roles('admin', 'user')
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
    if (interval.userId !== req.user.id) {
      throw new ForbiddenException('Access denied');
    }

    const updatedInterval = await this.intervalService.update(
      parseInt(id, 10),
      updateIntervalDto,
    );
    return res.json(updatedInterval);
  }

  @Delete('intervals/:id')
  @Roles('admin', 'user')
  async deleteInterval(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const interval = await this.intervalService.findById(parseInt(id, 10));
    if (!interval) {
      throw new ForbiddenException('Interval not found');
    }
    if (interval.userId !== req.user.id) {
      throw new ForbiddenException('Access denied');
    }

    await this.intervalService.delete(parseInt(id, 10));
    return res.json({ message: 'Interval deleted successfully' });
  }

  @Post('goals')
  @Roles('admin', 'user')
  async createGoal(
    @Body() createGoalDto: Partial<Goal>,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const currentUser = req.user;
    if (!currentUser) {
      throw new ForbiddenException('User not authenticated');
    }

    const { intervalId, name } = createGoalDto;
    const interval = await this.intervalService.findById(intervalId);

    if (!interval || interval.userId !== currentUser.id) {
      throw new ForbiddenException('Access denied or interval not found');
    }
    const goalData = {
      name,
      intervalId,
    };
    const newGoal = await this.goalService.create(goalData);
    return res.status(201).json(newGoal);
  }

  @Put('goals/:id')
  @Roles('admin', 'user')
  async updateGoal(
    @Param('id') id: string,
    @Body() updateGoalDto: Partial<Goal>,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const currentUser = req.user;
    const goal = await this.goalService.findById(parseInt(id, 10));

    if (!goal) {
      throw new ForbiddenException('Goal not found');
    }

    const interval = await this.intervalService.findById(goal.intervalId);

    if (!interval || interval.userId !== currentUser.id) {
      throw new ForbiddenException('Access denied or interval not found');
    }

    const updatedGoal = await this.goalService.update(
      parseInt(id, 10),
      updateGoalDto,
    );
    return res.json(updatedGoal);
  }

  @Delete('goals/:id')
  @Roles('admin', 'user')
  async deleteGoal(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const currentUser = req.user;
    const goal = await this.goalService.findById(parseInt(id, 10));

    if (!goal) {
      throw new ForbiddenException('Goal not found');
    }

    const interval = await this.intervalService.findById(goal.intervalId);

    if (!interval || interval.userId !== currentUser.id) {
      throw new ForbiddenException('Access denied or interval not found');
    }

    await this.goalService.delete(parseInt(id, 10));
    return res.json({ message: 'Goal deleted successfully' });
  }
}
