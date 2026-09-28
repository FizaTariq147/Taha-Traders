import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Inquiry, InquiryDocument } from '../common/schemas';
import { CreateInquiryDto, UpdateInquiryStatusDto } from '../common/dto';
import { serializeDoc, serializeMany } from '../common/utils';

@Injectable()
export class InquiriesService {
  constructor(
    @InjectModel(Inquiry.name) private readonly inquiries: Model<InquiryDocument>,
  ) {}

  async create(dto: CreateInquiryDto) {
    const created = await this.inquiries.create({
      ...dto,
      productId: dto.productId ? new Types.ObjectId(dto.productId) : undefined,
      quantity: dto.quantity ?? 1,
      status: 'new',
    });
    return serializeDoc(created);
  }

  async findAll() {
    return serializeMany(await this.inquiries.find().sort({ createdAt: -1 }));
  }

  async updateStatus(id: string, dto: UpdateInquiryStatusDto) {
    const item = await this.inquiries.findByIdAndUpdate(
      id,
      { status: dto.status },
      { new: true },
    );
    if (!item) throw new NotFoundException('Inquiry not found');
    return serializeDoc(item);
  }

  async counts() {
    const [total, pending] = await Promise.all([
      this.inquiries.countDocuments(),
      this.inquiries.countDocuments({ status: { $in: ['new', 'contacted'] } }),
    ]);
    const neu = await this.inquiries.countDocuments({ status: 'new' });
    return { total, pending, neu };
  }
}
