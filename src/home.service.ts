import { Injectable } from '@nestjs/common';

@Injectable()
export class HomeService {
  getWelcomeMessage(): string {
    return 'Welcome to the Mindful Zen API!';
  }
}
