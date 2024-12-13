import { RedisOptions } from 'ioredis';
import { ConfigService } from '@nestjs/config';

export const getRedisOptions = (configService: ConfigService): RedisOptions => {
  return {
    username: configService.get<string>('REDIS_USER') || undefined,
    host: configService.get<string>('REDIS_HOST', 'localhost'),
    port: configService.get<number>('REDIS_PORT', 6379),
    password: configService.get<string>('REDIS_PASSWORD') || undefined,
    keepAlive: 30000,
    connectTimeout: 10000,
    maxRetriesPerRequest: 5,
    retryStrategy: (times) => {
      return Math.min(times * 50, 2000);
    },
  };
};
