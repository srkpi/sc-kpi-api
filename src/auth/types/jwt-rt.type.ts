import { JwtPayload } from './jwt.type';

export type JwtRtPayload = {
  refreshToken: string;
  deviceId: string;
} & JwtPayload;
