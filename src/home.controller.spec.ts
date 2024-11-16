import { Test, TestingModule } from '@nestjs/testing';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { Response } from 'express';

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.json = jest.fn().mockReturnValue(res);
  res.render = jest.fn().mockReturnValue(res);
  return res as Response;
};

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

    const res = mockResponse();
    process.env.NODE_ENV = 'development';

    homeController.getHomePage(res);
    expect(res.render).toHaveBeenCalledWith('index', { message: result });
    delete process.env.NODE_ENV;
  });
});
