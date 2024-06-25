import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FaqController } from './faq.controller';
import { FaqService } from './faq.service';

@Module({
  controllers: [FaqController],
  providers: [FaqService],
  imports: [PrismaModule],
})
export class FaqModule {}
