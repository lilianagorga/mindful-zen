import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntervalController } from './interval.controller';
import { IntervalService } from './interval.service';
import { Interval } from '../entities/interval.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Interval])],
  controllers: [IntervalController],
  providers: [IntervalService],
  exports: [IntervalService],
})
export class IntervalModule {}
