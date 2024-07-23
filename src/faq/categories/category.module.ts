import { Module } from '@nestjs/common';
import { FaqCategoryController } from './category.controller';
import { FaqCategoryService } from './category.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [FaqCategoryController],
  providers: [FaqCategoryService],
  imports: [PrismaModule],
})
export class FaqCategoryModule {}
