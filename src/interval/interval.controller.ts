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
import { IntervalService } from './interval.service';
import { Interval } from '../entities/interval.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateIntervalDto } from './create-interval.dto';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';

@Controller('intervals')
@UseGuards(JwtAuthGuard, RolesGuard)
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
  @Roles('admin')
  createInterval(
    @Body() createIntervalDto: CreateIntervalDto,
  ): Promise<Interval> {
    const intervalData = {
      ...createIntervalDto,
      startDate: new Date(createIntervalDto.startDate),
      endDate: new Date(createIntervalDto.endDate),
    };
    return this.intervalService.create(intervalData);
  }

  @Put(':id')
  @Roles('admin')
  updateInterval(
    @Param('id') id: string,
    @Body() updateIntervalDto: Partial<Interval>,
  ): Promise<Interval> {
    return this.intervalService.update(parseInt(id, 10), updateIntervalDto);
  }

  @Patch(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  partialUpdateInterval(
    @Param('id') id: string,
    @Body() updateIntervalDto: Partial<Interval>,
  ): Promise<Interval> {
    return this.intervalService.update(parseInt(id, 10), updateIntervalDto);
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  deleteInterval(@Param('id') id: string): Promise<void> {
    return this.intervalService.delete(parseInt(id, 10));
  }
}
