import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { PUBLIC_KEY } from '../auth/decorators';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly logger = new Logger(ApiKeyGuard.name);
  private readonly xApiKey: string;

  constructor(
    private configService: ConfigService,
    private reflector: Reflector,
  ) {
    this.xApiKey = this.configService.get<string>('X_API_KEY');
    if (!this.xApiKey) {
      this.logger.warn('X_API_KEY is missing. Routes are unprotected.');
    }
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    if (!this.xApiKey) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    if (!apiKey || apiKey !== this.xApiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
