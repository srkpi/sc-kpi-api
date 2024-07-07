import { JwtPayload } from './jwt.type';

export type JwtRtPayload = {
  refreshToken: string;
} & JwtPayload;
