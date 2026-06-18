import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendResponse } from '../utils/response.formatter';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.authService.registerUser(req.body);
      sendResponse(res, 201, 'User registered successfully', user);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.loginUser(req.body);
      sendResponse(res, 200, 'User logged in successfully', result);
    } catch (error) {
      next(error);
    }
  };
}
