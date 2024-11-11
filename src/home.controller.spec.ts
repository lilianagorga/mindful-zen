import { Test, TestingModule } from '@nestjs/testing';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';

describe('HomeController', () => {
  let homeController: HomeController;
  let homeService: HomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeController],
      providers: [HomeService],
    }).compile();

    homeController = module.get<HomeController>(HomeController);
    homeService = module.get<HomeService>(HomeService);
  });

  it('should be defined', () => {
    expect(homeController).toBeDefined();
  });

  it('should return a welcome message', () => {
    const result = 'Welcome to the Mindful Zen API!';
    jest
      .spyOn(homeService, 'getWelcomeMessage')
      .mockImplementation(() => result);

    expect(homeController.getHomePage()).toBe(result);
  });
});
