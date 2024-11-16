import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token not present');
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET as string);
      request.user = payload;
    } catch {
      throw new UnauthorizedException('Token not valid');
    }

    return true;
  }

  private extractTokenFromHeader(request: any): string | null {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }
    if (request.cookies && request.cookies.jwt) {
      return request.cookies.jwt;
    }
    return null;
  }
}
