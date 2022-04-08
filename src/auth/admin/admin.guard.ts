import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string>('role', context.getHandler());

    if (!roles) {
      return true;
    }

    const user = context.switchToHttp().getRequest().user;

    if (roles === 'admin' && user.admin) return true;

    return false;
  }
}
