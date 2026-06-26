import { Request, Response, NextFunction } from 'express';
import { ProfileService } from '../services/profile.service';
import { sendResponse } from '../utils/response.formatter';
import { AppError } from '../utils/AppError';

export class ProfileController {
  private profileService: ProfileService;

  constructor() {
    this.profileService = new ProfileService();
  }

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AppError('Unauthorized: User context missing', 401);
      }

      const profile = await this.profileService.getMyProfile(req.user.id);
      sendResponse(res, 200, 'Profile retrieved successfully', profile);
    } catch (error) {
      next(error);
    }
  };

  updateMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AppError('Unauthorized: User context missing', 401);
      }

      const profile = await this.profileService.updateMyProfile(req.user.id, req.body);
      sendResponse(res, 200, 'Profile updated successfully', profile);
    } catch (error) {
      next(error);
    }
  };
}
