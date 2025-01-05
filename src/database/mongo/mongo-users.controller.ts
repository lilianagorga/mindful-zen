import { Controller, Get } from '@nestjs/common';
import { MongoService } from './mongo.service';

@Controller('mongo-users')
export class MongoUsersController {
  constructor(private readonly mongoService: MongoService) {}

  @Get()
  async findAll() {
    const usersCollection = this.mongoService.getCollection('users');
    return usersCollection.find().toArray();
  }

  @Get('intervals')
  async findAllIntervals() {
    const intervalsCollection = this.mongoService.getCollection('intervals');
    return intervalsCollection.find().toArray();
  }

  @Get('goals')
  async findAllGoals() {
    const goalsCollection = this.mongoService.getCollection('goals');
    return goalsCollection.find().toArray();
  }
}
