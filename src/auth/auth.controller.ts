import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AuthService } from './auth.service';
import { User } from './decorators';
import { AuthDto, TokensDto } from './dto';
import { AtGuard, RtGuard } from './guards';
import { JwtPayload, JwtRtPayload } from './types';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('local/sign-in')
  @HttpCode(HttpStatus.OK)
  async signInLocal(@Body() dto: AuthDto): Promise<TokensDto> {
    const tokens = await this.authService.signIn(dto);
    return plainToInstance(TokensDto, tokens);
  }

  @Post('local/sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUpLocal(@Body() dto: AuthDto): Promise<TokensDto> {
    const tokens = await this.authService.signUp(dto);
    return plainToInstance(TokensDto, tokens);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@User() user: JwtPayload) {
    return this.authService.logout(user.sub);
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.NO_CONTENT)
  async refreshToken(@User() user: JwtRtPayload) {
    return this.authService.refreshToken(user.sub, user.refreshToken);
  }
}
