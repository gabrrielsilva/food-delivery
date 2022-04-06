import { Prisma } from '@prisma/client';

export interface Register {
  user: Prisma.UserCreateInput;
  address: Prisma.AddressCreateInput;
}
