import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { IntervalController } from './interval.controller';
import { IntervalService } from './interval.service';
import { GoalController } from './goal.controller';
import { GoalService } from './goal.service';
import { HomeController } from './home.controller';
import { Goal } from './entities/goal.entity';
import { Interval } from './entities/interval.entity';
import { User } from './entities/user.entity';
import { HomeService } from './home.service';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Goal, Interval, User])],
  controllers: [
    AppController,
    UserController,
    IntervalController,
    GoalController,
    HomeController,
  ],
  providers: [
    AppService,
    UserService,
    IntervalService,
    GoalService,
    HomeService,
  ],
})
export class AppModule {}
