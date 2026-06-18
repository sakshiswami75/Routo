import { Request, Response, NextFunction } from 'express';
import { ParcelService } from '../services/parcel.service';
import { sendResponse } from '../utils/response.formatter';
import { AppError } from '../utils/AppError';

export class ParcelController {
  private parcelService: ParcelService;

  constructor() {
    this.parcelService = new ParcelService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AppError('Unauthorized: User context missing', 401);
      }
      
      const parcel = await this.parcelService.createParcel(req.user.id, req.body);
      sendResponse(res, 201, 'Parcel created successfully', parcel);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parcels = await this.parcelService.getAllParcels();
      sendResponse(res, 200, 'Parcels retrieved successfully', parcels);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const parcel = await this.parcelService.getParcelById(id);
      sendResponse(res, 200, 'Parcel retrieved successfully', parcel);
    } catch (error) {
      next(error);
    }
  };
}
