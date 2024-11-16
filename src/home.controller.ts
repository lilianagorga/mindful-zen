import { Controller, Get, Res } from '@nestjs/common';
import { HomeService } from './home.service';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  @Throttle({ default: { limit: 15, ttl: 60000 } })
  getHomePage(@Res() res: Response) {
    const message = this.homeService.getWelcomeMessage();
    if (process.env.NODE_ENV === 'test') {
      return res.json({ message });
    }
    const isApiRequest =
      res?.req?.headers?.['accept']?.includes('application/json');
    if (isApiRequest) {
      return res.json({ message });
    }
    return res.render('index', { message });
  }
}
