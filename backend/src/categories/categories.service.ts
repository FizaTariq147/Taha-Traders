import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../common/schemas';
import { CreateCategoryDto, UpdateCategoryDto } from '../common/dto';
import { serializeDoc, serializeMany, slugify } from '../common/utils';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private readonly categories: Model<CategoryDocument>,
  ) {}

  async findPublic() {
    const items = await this.categories
      .find({ active: true })
      .sort({ sortOrder: 1, name: 1 });
    return serializeMany(items);
  }

  async findBySlug(slug: string) {
    const item = await this.categories.findOne({ slug, active: true });
    if (!item) throw new NotFoundException('Category not found');
    return serializeDoc(item);
  }

  async findAllAdmin() {
    return serializeMany(await this.categories.find().sort({ sortOrder: 1 }));
  }

  async create(dto: CreateCategoryDto) {
    const slug = dto.slug ? slugify(dto.slug) : slugify(dto.name);
    const exists = await this.categories.findOne({ slug });
    if (exists) throw new ConflictException('Slug already exists');
    const created = await this.categories.create({ ...dto, slug });
    return serializeDoc(created);
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const update: Record<string, unknown> = { ...dto };
    if (dto.slug || dto.name) update.slug = slugify(dto.slug ?? dto.name!);
    const item = await this.categories.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    if (!item) throw new NotFoundException('Category not found');
    return serializeDoc(item);
  }

  async remove(id: string) {
    const item = await this.categories.findByIdAndUpdate(
      id,
      { active: false },
      { new: true },
    );
    if (!item) throw new NotFoundException('Category not found');
    return serializeDoc(item);
  }

  async countActive() {
    return this.categories.countDocuments({ active: true });
  }
}
