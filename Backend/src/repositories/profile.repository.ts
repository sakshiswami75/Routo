import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import { UpdateProfileInput } from '../validators/profile.validator';

export type UserProfile = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    createdAt: true;
    updatedAt: true;
  };
}>;

const userProfileSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class ProfileRepository {
  async findById(id: string): Promise<UserProfile | null> {
    return await prisma.user.findUnique({
      where: { id },
      select: userProfileSelect,
    });
  }

  async findByEmail(email: string): Promise<UserProfile | null> {
    return await prisma.user.findUnique({
      where: { email },
      select: userProfileSelect,
    });
  }

  async update(id: string, data: UpdateProfileInput): Promise<UserProfile> {
    return await prisma.user.update({
      where: { id },
      data,
      select: userProfileSelect,
    });
  }
}
