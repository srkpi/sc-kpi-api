import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import ms from 'ms';
import { AuthService } from './auth.service';
import { Public, User } from './decorators';
import {
  AtResponseDto,
  LoginDto,
  PasswordRecoveryDto,
  RecoveryDto,
  RegisterDto,
  ResetPasswordDto,
  UpdatePasswordDto,
} from './dto';
import { RecoveryThrottlerGuard, RtGuard } from './guards';
import { BlockCheckInterceptor } from './interceptors/block-check.interceptor';
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

  @Public()
  @UseGuards(RtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@User() user: JwtRtPayload, @Res() res: Response) {
    this.authService.clearAuthCookies(res);
    await this.authService.logout(user.sub, user.deviceId);
    res.send();
  }

  @Public()
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

  @UseGuards(RtGuard)
  @Put('password')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Password successfully updated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Old password is invalid',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'New password should be different from old',
  })
  async updatePassword(
    @Body() dto: UpdatePasswordDto,
    @User('sub') userId: number,
    @Res() res: Response,
  ) {
    await this.authService.updatePassword(dto, userId, res);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @Public()
  @UseInterceptors(BlockCheckInterceptor)
  @UseGuards(RecoveryThrottlerGuard)
  @Throttle({
    short: { limit: 1, ttl: ms('15m') },
    medium: { limit: 5, ttl: ms('2h') },
  })
  @Post('recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  async requestRecovery(
    @Body() dto: PasswordRecoveryDto,
    @Res() res: Response,
  ) {
    try {
      await this.authService.requestRecovery(dto.email);
      res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      res.status(HttpStatus.TOO_MANY_REQUESTS).send();
    }
  }

  @Public()
  @Get('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async getResetPage(@Query() query: RecoveryDto, @Res() res: Response) {
    await this.authService.getResetPage(query.token, res);
  }

  @Public()
  @Put('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto);
  }

  @UseGuards(RtGuard)
  @Delete('user')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@User() user: JwtRtPayload, @Res() res: Response) {
    this.authService.clearAuthCookies(res);
    await this.authService.deleteUser(user.sub);
    res.status(HttpStatus.NO_CONTENT).send();
  }
}
