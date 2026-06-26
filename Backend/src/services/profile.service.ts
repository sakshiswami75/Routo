import { ProfileRepository } from '../repositories/profile.repository';
import { UpdateProfileInput } from '../validators/profile.validator';
import { AppError } from '../utils/AppError';

export class ProfileService {
  private profileRepository: ProfileRepository;

  constructor() {
    this.profileRepository = new ProfileRepository();
  }

  async getMyProfile(userId: string) {
    if (!userId) {
      throw new AppError('Unauthorized: User ID is required', 401);
    }

    const user = await this.profileRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async updateMyProfile(userId: string, data: UpdateProfileInput) {
    if (!userId) {
      throw new AppError('Unauthorized: User ID is required', 401);
    }

    const user = await this.profileRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (data.email && data.email !== user.email) {
      const existingUser = await this.profileRepository.findByEmail(data.email);
      if (existingUser) {
        throw new AppError('Email already in use', 409);
      }
    }

    return await this.profileRepository.update(userId, data);
  }
}
