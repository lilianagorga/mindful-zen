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
import { IntervalService } from './interval.service';
import { Interval } from '../entities/interval.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateIntervalDto } from './create-interval.dto';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { Request, Response } from 'express';

@Controller('intervals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IntervalController {
  constructor(private readonly intervalService: IntervalService) {}

  @Get()
  @Roles('admin', 'user')
  async getAllIntervals(@Req() req: Request, @Res() res: Response) {
    const params = {
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      goalName: req.query.goalName as string,
      isAdmin: req.user.role === 'admin',
      userId: req.user.id as number,
    };

    const intervals = await this.intervalService.filterIntervals(params);
    return res.json(intervals);
  }

  @Get(':id')
  @Roles('admin', 'user')
  async getIntervalById(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const interval = await this.intervalService.findById(parseInt(id, 10));
    if (!interval) {
      return res.status(404).json({ message: 'Interval not found' });
    }
    if (req.user.role !== 'admin' && interval.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    return res.json(interval);
  }

  @Post()
  @Roles('admin', 'user')
  async createInterval(
    @Body() createIntervalDto: CreateIntervalDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = req.user.id;
    const intervalData = {
      ...createIntervalDto,
      userId,
      startDate: new Date(createIntervalDto.startDate),
      endDate: new Date(createIntervalDto.endDate),
    };

    const newInterval = await this.intervalService.create(intervalData);
    return res.json(newInterval);
  }

  @Put(':id')
  @Roles('admin', 'user')
  async updateInterval(
    @Param('id') id: string,
    @Body() updateIntervalDto: Partial<Interval>,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const interval = await this.intervalService.findById(parseInt(id, 10));
    if (!interval) {
      return res.status(404).json({ message: 'Interval not found' });
    }
    if (req.user.role !== 'admin' && interval.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedInterval = await this.intervalService.update(
      parseInt(id, 10),
      {
        ...updateIntervalDto,
        userId: req.user.id,
      },
    );
    return res.json(updatedInterval);
  }

  @Patch(':id')
  @Roles('admin', 'user')
  async partialUpdateInterval(
    @Param('id') id: string,
    @Body() updateIntervalDto: Partial<Interval>,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const interval = await this.intervalService.findById(parseInt(id, 10));
    if (!interval) {
      return res.status(404).json({ message: 'Interval not found' });
    }
    if (req.user.role !== 'admin' && interval.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedInterval = await this.intervalService.update(
      parseInt(id, 10),
      {
        ...updateIntervalDto,
        userId: req.user.id,
      },
    );
    return res.json(updatedInterval);
  }

  @Delete(':id')
  @Roles('admin', 'user')
  async deleteInterval(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const interval = await this.intervalService.findById(parseInt(id, 10));
    if (!interval) {
      return res.status(404).json({ message: 'Interval not found' });
    }
    if (req.user.role !== 'admin' && interval.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await this.intervalService.delete(parseInt(id, 10));
    return res.json({ message: 'Interval deleted successfully' });
  }
}
