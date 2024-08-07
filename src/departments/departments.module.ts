import { Module } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DepartmentProjectsModule } from './projects/projects.module';
import { ImgurModule } from '../imgur/imgur.module';

@Module({
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
  imports: [DepartmentProjectsModule, PrismaModule, ImgurModule],
})
export class DepartmentsModule {}
