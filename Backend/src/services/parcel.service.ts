import { ParcelRepository } from '../repositories/parcel.repository';
import { CreateParcelInput } from '../validators/parcel.validator';
import { AppError } from '../utils/AppError';

export class ParcelService {
  private parcelRepository: ParcelRepository;

  constructor() {
    this.parcelRepository = new ParcelRepository();
  }

  async createParcel(senderId: string, data: CreateParcelInput) {
    if (!senderId) {
      throw new AppError('Unauthorized: Sender ID is required', 401);
    }
    return await this.parcelRepository.create(senderId, data);
  }

  async getAllParcels() {
    return await this.parcelRepository.findAll();
  }

  async getParcelById(id: string) {
    const parcel = await this.parcelRepository.findById(id);
    if (!parcel) {
      throw new AppError('Parcel not found', 404);
    }
    return parcel;
  }
}
