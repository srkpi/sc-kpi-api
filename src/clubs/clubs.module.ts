import { Module } from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { ClubsController } from './clubs.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ClubsController],
  providers: [ClubsService],
  imports: [PrismaModule],
})
export class ClubsModule {}
