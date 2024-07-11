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
  private readonly xApiKey: string;

  constructor(private configService: ConfigService) {
    this.xApiKey = this.configService.get<string>('X_API_KEY');
    if (!this.xApiKey) {
      this.logger.warn('X_API_KEY is missing. Routes are unprotected.');
    }
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
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
