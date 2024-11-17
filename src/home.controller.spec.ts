import { Test, TestingModule } from '@nestjs/testing';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { Response, Request } from 'express';

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.json = jest.fn().mockReturnValue(res);
  res.render = jest.fn().mockReturnValue(res);
  return res as Response;
};

const mockRequest = () => {
  const req: Partial<Request> = {};
  req.user = undefined;
  return req as Request;
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
    const req = mockRequest();
    process.env.NODE_ENV = 'test';

    homeController.getHomePage(res, req);
    expect(res.json).toHaveBeenCalledWith({ message: result });
    delete process.env.NODE_ENV;
  });
});
