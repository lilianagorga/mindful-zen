import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
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
      const isOwner = user.id === parseInt(request.params.id, 10);
      if (user.role === 'admin') {
        return hasRole;
      }
      return hasRole && isOwner;
    }

    return hasRole;
  }
}