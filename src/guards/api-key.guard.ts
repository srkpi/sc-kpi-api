import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly logger = new Logger(ApiKeyGuard.name);

  constructor(private configService: ConfigService) {
    if (!process.env.X_API_KEY) {
      this.logger.warn('X_API_KEY is missing. Routes are unprotected.');
    }
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const xApiKey = this.configService.get<string>('X_API_KEY');
    if (!xApiKey) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    if (!apiKey || apiKey !== xApiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
