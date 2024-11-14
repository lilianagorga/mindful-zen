import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { HomeController } from './home.controller';
import { Goal } from './entities/goal.entity';
import { Interval } from './entities/interval.entity';
import { User } from './entities/user.entity';
import { HomeService } from './home.service';
import { UserModule } from './user/user.module';
import { IntervalModule } from './interval/interval.module';
import { GoalModule } from './goal/goal.module';
import { roles } from './roles/roles';
import { AccessControlModule } from 'nest-access-control';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Goal, Interval, User]),
    AccessControlModule.forRoles(roles),
    UserModule,
    IntervalModule,
    GoalModule,
  ],
  controllers: [AppController, HomeController],
  providers: [AppService, HomeService],
})
export class AppModule {}
