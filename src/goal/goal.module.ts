import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalController } from './goal.controller';
import { GoalService } from './goal.service';
import { Goal } from '../entities/goal.entity';
import { IntervalModule } from '../interval/interval.module';

@Module({
  imports: [TypeOrmModule.forFeature([Goal]), IntervalModule],
  controllers: [GoalController],
  providers: [GoalService],
  exports: [GoalService],
})
export class GoalModule {}
