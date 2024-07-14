import { Process, Processor } from '@nestjs/bull';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { Job } from 'bull';
import ms from 'ms';
import { PasswordRecoveryDto } from '../dto';

@Processor('recovery-queue')
export class RecoveryProcessor {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @Process()
  async processRecoveryJob(job: Job<PasswordRecoveryDto>) {
    const { email } = job.data;
    const key = `recovery-counter:${email}`;
    const counter = await this.cacheManager.get<number>(key);
    if (!counter) {
      await this.cacheManager.set(key, 1, ms('1h'));
      return;
    }
    if (counter <= 5) {
      const ttl = await this.cacheManager.store.ttl(key);
      await this.cacheManager.set(key, counter + 1, ttl);
      return;
    }
    await this.cacheManager.del(key);
    await this.cacheManager.set(`blocked-recovery:${email}`, true, ms('3h'));
    throw new HttpException(
      'Suspicious activity has been detected. Please try again later',
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
