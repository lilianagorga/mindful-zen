import { Controller, Get } from '@nestjs/common';
import { HomeService } from './home.service';
import { Throttle } from '@nestjs/throttler';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  @Throttle({ default: { limit: 15, ttl: 60000 } })
  getHomePage(): string {
    return this.homeService.getWelcomeMessage();
  }
}
