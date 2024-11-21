import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { UserService } from '../user/user.service';
import { IntervalService } from '../interval/interval.service';
import { GoalService } from '../goal/goal.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { ForbiddenException } from '@nestjs/common';
import { Interval } from '../entities/interval.entity';

describe('ProfileController', () => {
  let controller: ProfileController;
  let mockUserService: Partial<UserService>;
  let mockIntervalService: Partial<IntervalService>;
  let mockGoalService: Partial<GoalService>;

  beforeEach(async () => {
    mockUserService = {
      findById: jest.fn().mockResolvedValue({
        id: 1,
        email: 'user1@email.com',
        firstName: 'Test',
        lastName: 'User',
      }),
      update: jest.fn().mockResolvedValue({
        id: 1,
        email: 'updated@email.com',
        firstName: 'Updated',
        lastName: 'User',
      }),
      delete: jest.fn().mockResolvedValue(undefined),
    };

    mockIntervalService = {
      findByUserOrPublic: jest
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
      findByUserOrPublic: jest
        .fn()
        .mockResolvedValue([{ id: 1, name: 'Goal 1', intervalId: 1 }]),
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
      controllers: [ProfileController],
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

    controller = module.get<ProfileController>(ProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return user profile data', async () => {
      const mockResponse = { render: jest.fn() };
      const mockRequest = { user: { id: 1, role: 'user' } };

      await controller.getProfile(mockResponse as any, mockRequest as any);

      expect(mockResponse.render).toHaveBeenCalledWith('profile', {
        user: await mockUserService.findById(1),
        intervals: await mockIntervalService.findByUserOrPublic(1),
        goals: await mockGoalService.findByUserOrPublic(1),
        currentUser: mockRequest.user,
      });
    });

    it('should throw ForbiddenException if user is not authenticated', async () => {
      const mockResponse = { render: jest.fn() };
      const mockRequest = { user: null };

      await expect(
        controller.getProfile(mockResponse as any, mockRequest as any),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('updateProfile', () => {
    it('should update the user profile', async () => {
      const mockResponse = { json: jest.fn() };
      const mockRequest = { user: { id: 1, role: 'user' } };
      const updateUserDto = { email: 'new@email.com' };

      await controller.updateProfile(
        updateUserDto,
        mockRequest as any,
        mockResponse as any,
      );

      expect(mockUserService.update).toHaveBeenCalledWith(1, updateUserDto);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Profile updated successfully',
        updatedUser: await mockUserService.update(1, updateUserDto),
      });
    });

    it('should throw ForbiddenException if user is not authenticated', async () => {
      const mockResponse = { json: jest.fn() };
      const mockRequest = { user: null };
      const updateUserDto = { email: 'new@email.com' };

      await expect(
        controller.updateProfile(
          updateUserDto,
          mockRequest as any,
          mockResponse as any,
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deleteProfile', () => {
    it('should delete the user profile', async () => {
      const mockResponse = { json: jest.fn() };
      const mockRequest = { user: { id: 1, role: 'user' } };

      await controller.deleteProfile(mockRequest as any, mockResponse as any);

      expect(mockUserService.delete).toHaveBeenCalledWith(1);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Profile deleted successfully',
      });
    });

    it('should throw ForbiddenException if user is not authenticated', async () => {
      const mockResponse = { json: jest.fn() };
      const mockRequest = { user: null };

      await expect(
        controller.deleteProfile(mockRequest as any, mockResponse as any),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('createInterval', () => {
    it('should create an interval for the current user', async () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockRequest = { user: { id: 1, role: 'user' } };
      const createIntervalDto = {
        startDate: new Date(),
        endDate: new Date(Date.now() + 3600 * 1000),
      };

      await controller.createInterval(
        createIntervalDto,
        mockRequest as any,
        mockResponse as any,
      );

      expect(mockIntervalService.create).toHaveBeenCalledWith({
        ...createIntervalDto,
        userId: 1,
        startDate: new Date(createIntervalDto.startDate),
        endDate: new Date(createIntervalDto.endDate),
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        await mockIntervalService.create({
          ...createIntervalDto,
          userId: 1,
        }),
      );
    });
  });

  describe('deleteInterval', () => {
    it('should delete an interval if user has access', async () => {
      const mockResponse = { json: jest.fn() };
      const mockRequest = { user: { id: 1, role: 'user' } };

      await controller.deleteInterval(
        '1',
        mockRequest as any,
        mockResponse as any,
      );

      expect(mockIntervalService.delete).toHaveBeenCalledWith(1);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Interval deleted successfully',
      });
    });

    it('should throw ForbiddenException if interval does not belong to user', async () => {
      const mockResponse = { json: jest.fn() };
      const mockRequest = { user: { id: 2, role: 'user' } };

      jest.spyOn(mockIntervalService, 'findById').mockResolvedValueOnce({
        id: 1,
        userId: 1,
        startDate: new Date(),
        endDate: new Date(),
        user: {},
        goals: [],
      } as Interval);

      await expect(
        controller.deleteInterval('1', mockRequest as any, mockResponse as any),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('createGoal', () => {
    it('should create a goal if user has access to interval', async () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockRequest = { user: { id: 1, role: 'user' } };
      const createGoalDto = { intervalId: 1, name: 'New Goal' };

      await controller.createGoal(
        createGoalDto,
        mockRequest as any,
        mockResponse as any,
      );

      expect(mockGoalService.create).toHaveBeenCalledWith(createGoalDto);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        await mockGoalService.create(createGoalDto),
      );
    });
  });
});
