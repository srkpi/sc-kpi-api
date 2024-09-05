import { InjectQueue } from '@nestjs/bull';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Queue } from 'bull';
import { CookieOptions, Response } from 'express';
import ms from 'ms';
import { MailService } from 'src/mail/mail.service';
import { UsersService } from 'src/users/users.service';
import { v4 as uuid } from 'uuid';
import { LoginDto, ResetPasswordDto, UpdatePasswordDto } from './dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload, Tokens } from './types';

@Injectable()
export class AuthService {
  private readonly cookieOptions: CookieOptions = {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'none',
    secure: true,
  };

  constructor(
    private config: ConfigService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectQueue('recovery-queue') private recoveryQueue: Queue,
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

  async updatePassword(dto: UpdatePasswordDto, userId: number, res: Response) {
    const user = await this.usersService.findUserById(userId);
    const isPasswordValid = await bcrypt.compare(
      dto.oldPassword,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new ForbiddenException('Old password is invalid');
    }
    if (dto.oldPassword === dto.newPassword) {
      throw new BadRequestException('New password should be different');
    }
    await this.changePassword(userId, dto.newPassword);

    const tokens = await this.getTokens(userId, user.email, user.role);
    this.setAuthCookies(res, tokens);
  }

  async requestRecovery(email: string) {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new ForbiddenException('User with this email does not exist');
    }
    const job = await this.recoveryQueue.add({ email }, { removeOnFail: true });
    await job.finished();
    const token = uuid();
    await this.cacheManager.set(token, email, ms('15m'));
    await this.mailService.sendPasswordRecoveryEmail(email, token);
  }

  async getResetPage(token: string, res: Response) {
    res.redirect(
      `${this.config.get<string>('FRONTEND_HOME_URI')}?token=${token}`,
    );
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { token, newPassword } = dto;
    const email = await this.cacheManager.get<string>(token);
    if (!email) {
      throw new NotFoundException('Time is up. Please try again');
    }
    const user = await this.usersService.findUserByEmail(email);
    await this.changePassword(user.id, newPassword);
    await this.cacheManager.del(token);
  }

  private async changePassword(userId: number, newPassword: string) {
    const cacheKeys = await this.cacheManager.store.keys(`rt:${userId}:*`);
    for (const key of cacheKeys) {
      await this.cacheManager.del(key);
    }
    const hash = await this.hashData(newPassword);
    await this.usersService.updatePassword(userId, hash);
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
        expiresIn: '3m',
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

  async deleteUser(userId: number) {
    await this.usersService.remove(userId);

    const cacheKeys = await this.cacheManager.store.keys(`rt:${userId}:*`);
    for (const key of cacheKeys) {
      await this.cacheManager.del(key);
    }
  }
}
