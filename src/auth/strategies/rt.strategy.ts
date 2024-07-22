import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from '../types';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private config: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        return req?.cookies?.['refreshToken'] || null;
      },
      secretOrKey: config.get<string>('RT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const refreshToken = req.cookies?.['refreshToken'];
    if (!refreshToken) {
      throw new ForbiddenException('Refresh token is not valid');
    }
    const isExists = await this.usersService.exists(payload.sub);
    if (!isExists) {
      throw new NotFoundException('User with this id no longer exists');
    }
    const deviceId = req.cookies?.['deviceId'];
    if (!deviceId) {
      throw new ForbiddenException('Device id is not valid');
    }
    return {
      ...payload,
      refreshToken,
      deviceId,
    };
  }
}
