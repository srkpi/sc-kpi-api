import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../types';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PUBLIC_KEY } from '../decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const hasRequiredRole = requiredRoles.some((role) => user?.role == role);
    if (!hasRequiredRole) {
      throw new ForbiddenException(
        'Required roles for this operation: ' + requiredRoles.join(', '),
      );
    }

    return true;
  }
}
