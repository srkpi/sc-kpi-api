import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Observable } from 'rxjs';

@Injectable()
export class BlockCheckInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { email } = request.body;

    const isBlocked = await this.cacheManager.get<boolean>(
      `blocked-recovery:${email}`,
    );
    if (isBlocked) {
      throw new HttpException(
        'Suspicious activity has been detected. Please try again later',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return next.handle();
  }
}
