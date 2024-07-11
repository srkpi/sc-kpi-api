import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CookieOptions, Response } from 'express';
import ms from 'ms';
import { UsersService } from 'src/users/users.service';
import { v4 as uuid } from 'uuid';
import { LoginDto } from './dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload, Tokens } from './types';

@Injectable()
export class AuthService {
  private readonly cookieOptions: CookieOptions = {
    httpOnly: true,
    maxAge: ms('7d'),
    sameSite: 'lax',
  };

  constructor(
    private config: ConfigService,
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async register(dto: RegisterDto): Promise<Tokens> {
    const user = await this.usersService.findUserByEmail(dto.email);
    if (user) {
      throw new BadRequestException('User with this email already exists');
    }
    const { password, ...userData } = dto;
    const hash = await this.hashData(password);
    const newUser = await this.usersService.create({
      ...userData,
      passwordHash: hash,
    });
    return this.getTokens(newUser.id, newUser.email, newUser.role);
  }

  async login(dto: LoginDto): Promise<Tokens> {
    const user = await this.usersService.findUserByEmail(dto.email);
    if (!user) {
      throw new ForbiddenException('User with this email does not exist');
    }
    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatch) {
      throw new ForbiddenException('Email for the user is invalid');
    }
    return this.getTokens(user.id, user.email, user.role);
  }

  async logout(userId: number, deviceId: string) {
    console.log('key', `rt:${userId}:${deviceId}`);
    await this.cacheManager.del(`rt:${userId}:${deviceId}`);
  }

  async refreshToken(
    userId: number,
    rt: string,
    deviceId: string,
    res: Response,
  ) {
    const user = await this.usersService.findUserById(userId);
    if (!user) {
      await this.cacheManager.del(`rt:${userId}:${deviceId}`);
      this.clearAuthCookies(res);
      throw new ForbiddenException('User with this id does not exist');
    }
    const hashedRt = await this.cacheManager.get<string>(
      `rt:${userId}:${deviceId}`,
    );
    if (!hashedRt) {
      this.clearAuthCookies(res);
      throw new ForbiddenException('Refresh token is not valid');
    }
    const rtMatch = await bcrypt.compare(rt, hashedRt);
    if (!rtMatch) {
      throw new ForbiddenException('Refresh token is invalid');
    }
    return this.getTokens(user.id, user.email, user.role, deviceId);
  }

  setAuthCookies(res: Response, tokens: Tokens) {
    res.cookie('refreshToken', tokens.refreshToken, this.cookieOptions);
    res.cookie('deviceId', tokens.deviceId, this.cookieOptions);
  }

  clearAuthCookies(res: Response) {
    res.clearCookie('refreshToken', this.cookieOptions);
    res.clearCookie('deviceId', this.cookieOptions);
  }

  private async updateRtHash(userId: number, rt: string, deviceId: string) {
    const rtHash = await this.hashData(rt);
    await this.cacheManager.set(`rt:${userId}:${deviceId}`, rtHash, ms('7d'));
  }

  private async getTokens(
    userId: number,
    email: string,
    role: string,
    deviceId?: string | undefined,
  ): Promise<Tokens> {
    const payload: JwtPayload = { sub: userId, email, role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('AT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('RT_SECRET'),
        expiresIn: '7d',
      }),
    ]);
    deviceId = deviceId || uuid();

    await this.updateRtHash(userId, refreshToken, deviceId);

    return { accessToken, refreshToken, deviceId };
  }

  private hashData(data: string) {
    return bcrypt.hash(data, 10);
  }
}
