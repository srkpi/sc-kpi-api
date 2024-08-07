import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FaqController } from './faq.controller';
import { FaqService } from './faq.service';
import { FaqCategoryModule } from './categories/category.module';

@Module({
  controllers: [FaqController],
  providers: [FaqService],
  imports: [PrismaModule, FaqCategoryModule],
})
export class FaqModule {}
