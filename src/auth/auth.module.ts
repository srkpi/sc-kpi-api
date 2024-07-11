import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AtGuard, RolesGuard } from './guards';
import { AtStrategy, RtStrategy } from './strategies';

@Module({
  imports: [UsersModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy, AtGuard, RolesGuard],
  exports: [AtGuard, RolesGuard],
})
export class AuthModule {}
