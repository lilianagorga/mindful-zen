import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { UserService } from '../user/user.service';
import { IntervalService } from '../interval/interval.service';
import { GoalService } from '../goal/goal.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { ForbiddenException } from '@nestjs/common';

describe('DashboardController', () => {
  let controller: DashboardController;
  let mockUserService: Partial<UserService>;
  let mockIntervalService: Partial<IntervalService>;
  let mockGoalService: Partial<GoalService>;

  beforeEach(async () => {
    mockUserService = {
      findAll: jest.fn().mockResolvedValue([
        { id: 1, email: 'user1@email.com', role: 'user' },
        { id: 2, email: 'admin@email.com', role: 'admin' },
      ]),
      findById: jest
        .fn()
        .mockResolvedValue({ id: 1, email: 'user1@email.com' }),
      update: jest
        .fn()
        .mockResolvedValue({ id: 1, email: 'updated@email.com' }),
      delete: jest.fn().mockResolvedValue(undefined),
    };

    mockIntervalService = {
      findAllWithUsers: jest
        .fn()
        .mockResolvedValue([
          { id: 1, startDate: new Date(), endDate: new Date(), userId: 1 },
        ]),
      findById: jest.fn().mockResolvedValue({
        id: 1,
        startDate: new Date(),
        endDate: new Date(),
        userId: 1,
      }),
      update: jest.fn().mockResolvedValue({
        id: 1,
        startDate: new Date(),
        endDate: new Date(),
        userId: 1,
      }),
      delete: jest.fn().mockResolvedValue(undefined),
      create: jest.fn().mockResolvedValue({
        id: 2,
        startDate: new Date(),
        endDate: new Date(),
        userId: 1,
      }),
    };

    mockGoalService = {
      findAll: jest.fn().mockResolvedValue([
        { id: 1, name: 'Goal 1', intervalId: 1 },
        { id: 2, name: 'Goal 2', intervalId: 1 },
      ]),
      findById: jest.fn().mockResolvedValue({
        id: 1,
        name: 'Goal 1',
        intervalId: 1,
      }),
      update: jest.fn().mockResolvedValue({
        id: 1,
        name: 'Updated Goal',
        intervalId: 1,
      }),
      delete: jest.fn().mockResolvedValue(undefined),
      create: jest.fn().mockResolvedValue({
        id: 3,
        name: 'New Goal',
        intervalId: 1,
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: IntervalService, useValue: mockIntervalService },
        { provide: GoalService, useValue: mockGoalService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<DashboardController>(DashboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDashboard', () => {
    it('should return data for dashboard', async () => {
      const mockResponse = {
        render: jest.fn(),
      };
      const mockRequest = {
        user: { id: 1, role: 'admin' },
      };

      await controller.getDashboard(mockResponse as any, mockRequest as any);

      expect(mockResponse.render).toHaveBeenCalledWith('dashboard', {
        users: await mockUserService.findAll(),
        intervals: await mockIntervalService.findAllWithUsers(),
        goals: await mockGoalService.findAll(),
        currentUser: mockRequest.user,
      });
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const mockRequest = {
        user: { id: 1, role: 'admin' },
      };
      const mockResponse = {
        json: jest.fn(),
      };

      const updateUserDto = { email: 'new@email.com' };
      const expectedResult = { id: 1, email: 'updated@email.com' };
      await controller.updateUser(
        '1',
        updateUserDto,
        mockRequest as any,
        mockResponse as any,
      );
      expect(mockUserService.update).toHaveBeenCalledWith(1, updateUserDto);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResult);
    });

    it('should throw ForbiddenException if user not found', async () => {
      const mockRequest = {
        user: { id: 1, role: 'admin' },
      };
      const mockResponse = {
        json: jest.fn(),
      };

      jest.spyOn(mockUserService, 'findById').mockResolvedValueOnce(null);

      await expect(
        controller.updateUser(
          '1',
          { email: 'new@email.com' },
          mockRequest as any,
          mockResponse as any,
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const mockResponse = {
        json: jest.fn(),
      };

      await controller.deleteUser('1', mockResponse as any);

      expect(mockUserService.delete).toHaveBeenCalledWith(1);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User deleted successfully',
      });
    });
  });

  describe('createInterval', () => {
    it('should create an interval', async () => {
      const mockRequest = {};
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const createIntervalDto = {
        startDate: new Date(),
        endDate: new Date(),
        userId: 1,
      };

      const expectedResult = {
        id: 2,
        startDate: createIntervalDto.startDate.toISOString(),
        endDate: createIntervalDto.endDate.toISOString(),
        userId: createIntervalDto.userId,
      };

      mockIntervalService.create = jest.fn().mockResolvedValue({
        id: 2,
        startDate: expectedResult.startDate,
        endDate: expectedResult.endDate,
        userId: expectedResult.userId,
      });

      await controller.createInterval(
        createIntervalDto,
        mockRequest as any,
        mockResponse as any,
      );

      expect(mockIntervalService.create).toHaveBeenCalledWith(
        createIntervalDto,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expectedResult.id,
          startDate: expectedResult.startDate,
          endDate: expectedResult.endDate,
          userId: expectedResult.userId,
        }),
      );
    });
  });

  describe('deleteInterval', () => {
    it('should delete an interval', async () => {
      const mockResponse = {
        json: jest.fn(),
      };

      await controller.deleteInterval('1', mockResponse as any);

      expect(mockIntervalService.delete).toHaveBeenCalledWith(1);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Interval deleted successfully',
      });
    });
  });

  describe('updateInterval', () => {
    it('should update an interval', async () => {
      const mockRequest = {};
      const mockResponse = {
        json: jest.fn(),
      };

      const updateIntervalDto = {
        startDate: new Date(),
        endDate: new Date(),
      };

      const expectedResult = {
        id: 1,
        startDate: updateIntervalDto.startDate.toISOString(),
        endDate: updateIntervalDto.endDate.toISOString(),
        userId: 1,
      };

      mockIntervalService.update = jest.fn().mockResolvedValue({
        id: 1,
        startDate: expectedResult.startDate,
        endDate: expectedResult.endDate,
        userId: 1,
      });

      await controller.updateInterval(
        '1',
        updateIntervalDto,
        mockRequest as any,
        mockResponse as any,
      );

      expect(mockIntervalService.update).toHaveBeenCalledWith(
        1,
        updateIntervalDto,
      );
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expectedResult.id,
          startDate: expectedResult.startDate,
          endDate: expectedResult.endDate,
          userId: expectedResult.userId,
        }),
      );
    });

    it('should throw ForbiddenException if interval not found', async () => {
      const mockRequest = {};
      const mockResponse = {
        json: jest.fn(),
      };

      jest.spyOn(mockIntervalService, 'findById').mockResolvedValueOnce(null);

      await expect(
        controller.updateInterval(
          '1',
          { startDate: new Date(), endDate: new Date() },
          mockRequest as any,
          mockResponse as any,
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('createGoal', () => {
    it('should create a goal', async () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const createGoalDto = {
        intervalId: 1,
        name: 'New Goal',
      };

      const expectedResult = {
        id: 3,
        name: createGoalDto.name,
        intervalId: createGoalDto.intervalId,
      };

      await controller.createGoal(createGoalDto, mockResponse as any);

      expect(mockGoalService.create).toHaveBeenCalledWith(createGoalDto);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResult);
    });
  });

  describe('updateGoal', () => {
    it('should update a goal', async () => {
      const mockResponse = {
        json: jest.fn(),
      };

      const updateGoalDto = {
        name: 'Updated Goal Name',
      };

      const expectedResult = {
        id: 1,
        name: updateGoalDto.name,
        intervalId: 1,
      };

      mockGoalService.update = jest.fn().mockResolvedValue({
        id: 1,
        name: updateGoalDto.name,
        intervalId: 1,
      });

      await controller.updateGoal('1', updateGoalDto, mockResponse as any);

      expect(mockGoalService.update).toHaveBeenCalledWith(1, updateGoalDto);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResult);
    });

    it('should return 404 if goal not found', async () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest.spyOn(mockGoalService, 'findById').mockResolvedValueOnce(null);

      await controller.updateGoal(
        '1',
        { name: 'Updated Goal Name' },
        mockResponse as any,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Goal not found',
      });
    });
  });

  describe('deleteGoal', () => {
    it('should delete a goal', async () => {
      const mockResponse = {
        json: jest.fn(),
      };

      await controller.deleteGoal('1', mockResponse as any);

      expect(mockGoalService.delete).toHaveBeenCalledWith(1);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Goal deleted successfully',
      });
    });

    it('should return 404 if goal not found', async () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest.spyOn(mockGoalService, 'findById').mockResolvedValueOnce(null);

      await controller.deleteGoal('1', mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Goal not found',
      });
    });
  });
});
