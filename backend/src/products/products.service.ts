import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './product.schema';
import { CreateProductDto, UpdateProductDto } from '../common/dto';
import { serializeDoc, serializeMany, slugify } from '../common/utils';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly products: Model<ProductDocument>,
  ) {}

  async findPublic(query: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    color?: string;
    size?: string;
    availability?: string;
    featured?: boolean;
    newArrival?: boolean;
    sort?: string;
    page?: number;
    limit?: number;
  }) {
    const filter: Record<string, unknown> = { active: true };
    if (query.search) filter.$text = { $search: query.search };
    if (query.category) filter.categoryId = new Types.ObjectId(query.category);
    if (query.availability) filter.availability = query.availability;
    if (query.featured !== undefined) filter.featured = query.featured;
    if (query.newArrival !== undefined) filter.newArrival = query.newArrival;
    if (query.color) filter.colors = query.color;
    if (query.size) filter.sizes = query.size;
    if (query.minPrice != null || query.maxPrice != null) {
      filter.price = {
        ...(query.minPrice != null ? { $gte: query.minPrice } : {}),
        ...(query.maxPrice != null ? { $lte: query.maxPrice } : {}),
      };
    }

    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(48, Math.max(1, query.limit ?? 12));
    const skip = (page - 1) * limit;

    let sort: Record<string, 1 | -1> = { createdAt: -1 };
    switch (query.sort) {
      case 'price_asc':
        sort = { price: 1 };
        break;
      case 'price_desc':
        sort = { price: -1 };
        break;
      case 'name':
        sort = { name: 1 };
        break;
      case 'newest':
      default:
        sort = { createdAt: -1 };
    }

    const [items, total] = await Promise.all([
      this.products.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      this.products.countDocuments(filter),
    ]);

    return {
      items: serializeMany(items),
      total,
      page,
      limit,
      pages: Math.ceil(total / limit) || 1,
    };
  }

  async findBySlug(slug: string) {
    const product = await this.products.findOne({ slug, active: true });
    if (!product) throw new NotFoundException('Product not found');
    return serializeDoc(product);
  }

  async findRelated(categoryId: string, excludeId: string, limit = 4) {
    const items = await this.products
      .find({
        active: true,
        categoryId: new Types.ObjectId(categoryId),
        _id: { $ne: new Types.ObjectId(excludeId) },
      })
      .limit(limit);
    return serializeMany(items);
  }

  async findAllAdmin() {
    const items = await this.products.find().sort({ updatedAt: -1 });
    return serializeMany(items);
  }

  async findById(id: string) {
    const product = await this.products.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return serializeDoc(product);
  }

  async create(dto: CreateProductDto) {
    const slug = dto.slug ? slugify(dto.slug) : slugify(dto.name);
    const exists = await this.products.findOne({ $or: [{ slug }, { sku: dto.sku }] });
    if (exists) throw new ConflictException('Slug or SKU already exists');
    const stockTotal =
      dto.stockTotal ??
      (dto.variants?.reduce((sum, v) => sum + (v.stock ?? 0), 0) ?? 0);
    const created = await this.products.create({
      ...dto,
      slug,
      stockTotal,
      categoryId: new Types.ObjectId(dto.categoryId),
    });
    return serializeDoc(created);
  }

  async update(id: string, dto: UpdateProductDto) {
    const slug = dto.slug ? slugify(dto.slug) : dto.name ? slugify(dto.name) : undefined;
    const update: Record<string, unknown> = { ...dto };
    if (slug) update.slug = slug;
    if (dto.categoryId) update.categoryId = new Types.ObjectId(dto.categoryId);
    if (dto.variants) {
      update.stockTotal =
        dto.stockTotal ??
        dto.variants.reduce((sum, v) => sum + (v.stock ?? 0), 0);
    }
    const product = await this.products.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    if (!product) throw new NotFoundException('Product not found');
    return serializeDoc(product);
  }

  async remove(id: string) {
    const product = await this.products.findByIdAndUpdate(
      id,
      { active: false },
      { new: true },
    );
    if (!product) throw new NotFoundException('Product not found');
    return serializeDoc(product);
  }

  async counts() {
    const [total, active, featured, lowStock] = await Promise.all([
      this.products.countDocuments(),
      this.products.countDocuments({ active: true }),
      this.products.countDocuments({ featured: true, active: true }),
      this.products.countDocuments({ active: true, stockTotal: { $gt: 0, $lte: 10 } }),
    ]);
    return { total, active, featured, lowStock };
  }
}
