import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);

  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async setKey(key: string, value: string, ttl: number): Promise<void> {
    try {
      await this.redisClient.set(key, value, 'PX', ttl);
    } catch (error) {
      this.logger.error('Failed to set key: ', error);
      throw error;
    }
  }

  async getValue(key: string): Promise<string | null> {
    try {
      return await this.redisClient.get(key);
    } catch (error) {
      this.logger.error('Failed to get key: ', error);
      throw error;
    }
  }

  async deleteKey(key: string): Promise<void> {
    try {
      await this.redisClient.del(key);
    } catch (error) {
      this.logger.error('Failed to delete key: ', error);
      throw error;
    }
  }

  async deleteSubset(pattern: string): Promise<void> {
    const keys = await this.findSubset(pattern);
    for (const key of keys) {
      await this.deleteKey(key);
    }
  }

  private async findSubset(pattern: string) {
    return this.redisClient.keys(pattern);
  }

  async getTTL(key: string): Promise<number> {
    return (await this.redisClient.ttl(key)) * 1000;
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }
}
