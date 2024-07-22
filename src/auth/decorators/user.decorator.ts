import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtRtPayload } from '../types';

export const User = createParamDecorator(
  (data: keyof JwtRtPayload | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request?.user;
    return request.user[data];
  },
);
