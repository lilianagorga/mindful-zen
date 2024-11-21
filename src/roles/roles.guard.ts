import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  Optional,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { IntervalService } from '../interval/interval.service';
import { GoalService } from '../goal/goal.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Optional()
    @Inject(IntervalService)
    private readonly intervalService?: IntervalService,
    @Optional()
    @Inject(GoalService)
    private readonly goalService?: GoalService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    const hasRole = requiredRoles.some((role) => user?.role === role);

    if (requiredRoles.includes('user') && request.params.id) {
      const isIntervalRoute = request.route?.path?.includes('/intervals');
      const isGoalRoute = request.route?.path?.includes('/goals');
      if (isIntervalRoute && this.intervalService) {
        const interval = await this.intervalService.findById(
          parseInt(request.params.id, 10),
        );
        const isOwner = interval && interval.userId === user.id;

        if (user.role === 'admin') {
          return hasRole;
        }
        return hasRole && isOwner;
      }

      if (isGoalRoute && this.goalService) {
        const goal = await this.goalService.findById(
          parseInt(request.params.id, 10),
        );
        const isOwner = goal && goal.interval.userId === user.id;

        if (user.role === 'admin') {
          return hasRole;
        }
        return hasRole && isOwner;
      }

      const isOwner = user.id === parseInt(request.params.id, 10);
      if (user.role === 'admin') {
        return hasRole;
      }
      return hasRole && isOwner;
    }

    return hasRole;
  }
}
