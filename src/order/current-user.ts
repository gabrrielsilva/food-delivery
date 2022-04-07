import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthUser = createParamDecorator(
  (data: unknown, req: ExecutionContext) => {
    return req.switchToHttp().getRequest().user;
  },
);
