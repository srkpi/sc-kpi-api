import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { Public, User } from './decorators';
import { LoginDto, RegisterDto } from './dto';
import { AtResponseDto } from './dto/at-response.dto';
import { RtGuard } from './guards';
import { JwtRtPayload } from './types';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('local/sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: AtResponseDto })
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const tokens = await this.authService.login(dto);
    this.authService.setAuthCookies(res, tokens);
    res.json({ accessToken: tokens.accessToken });
  }

  @Public()
  @Post('local/sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ type: AtResponseDto })
  async register(@Body() dto: RegisterDto, @Res() res: Response) {
    const tokens = await this.authService.register(dto);
    this.authService.setAuthCookies(res, tokens);
    res.json({ accessToken: tokens.accessToken });
  }

  @UseGuards(RtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@User() user: JwtRtPayload, @Res() res: Response) {
    this.authService.clearAuthCookies(res);
    await this.authService.logout(user.sub, user.deviceId);
    res.send();
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: AtResponseDto })
  async refreshToken(@User() user: JwtRtPayload, @Res() res: Response) {
    const tokens = await this.authService.refreshToken(
      user.sub,
      user.refreshToken,
      user.deviceId,
      res,
    );
    this.authService.setAuthCookies(res, tokens);
    res.json({ accessToken: tokens.accessToken });
  }

  @Public()
  @Get('email')
  async email() {
    await this.authService.updatePassword('ole9zp@gmail.com');
    return 'ok';
  }
}
