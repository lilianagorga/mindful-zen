import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { Goal } from './entities/goal.entity';
import { Interval } from './entities/interval.entity';
import { User } from './entities/user.entity';
import { UserModule } from './user/user.module';
import { IntervalModule } from './interval/interval.module';
import { GoalModule } from './goal/goal.module';
import { roles } from './roles/roles';
import { AccessControlModule } from 'nest-access-control';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { HomeModule } from './home/home.module';
import { DashboardController } from './UI/dashboard.controller';
import { ProfileController } from './UI/profile.controller';
import { RolesGuard } from './roles/roles.guard';
import { MongoUsersController } from './database/mongo/mongo-users.controller';
import { MongoService } from './database/mongo/mongo.service';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Goal, Interval, User]),
    AccessControlModule.forRoles(roles),
    UserModule,
    IntervalModule,
    GoalModule,
    HomeModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
  ],
  controllers: [DashboardController, ProfileController, MongoUsersController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    RolesGuard,
    MongoService,
  ],
})
export class AppModule {}
