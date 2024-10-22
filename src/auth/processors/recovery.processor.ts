import { Process, Processor } from '@nestjs/bull';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Job } from 'bull';
import ms from 'ms';
import { PasswordRecoveryDto } from '../dto';
import { RedisService } from '../../redis/redis.service';

@Processor('recovery-queue')
export class RecoveryProcessor {
  constructor(private redisService: RedisService) {}

  @Process()
  async processRecoveryJob(job: Job<PasswordRecoveryDto>) {
    const { email } = job.data;
    const key = `recovery-counter:${email}`;
    const counter = parseInt(await this.redisService.getValue(key));
    if (!counter) {
      await this.redisService.setKey(key, '1', ms('1h'));
      return;
    }
    if (counter <= 5) {
      const ttl = await this.redisService.getTTL(key);
      await this.redisService.setKey(key, `${counter + 1}`, ttl);
      return;
    }
    await this.redisService.deleteKey(key);
    await this.redisService.setKey(`blocked-recovery:${email}`, '1', ms('3h'));
    throw new HttpException(
      'Suspicious activity has been detected. Please try again later',
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
