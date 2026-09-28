import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug!: string;

  @Prop()
  description?: string;

  @Prop()
  imageUrl?: string;

  @Prop({ default: 0 })
  sortOrder!: number;

  @Prop({ default: true })
  active!: boolean;

  @Prop({ default: false })
  isDemo!: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

export type ProductDocument = HydratedDocument<Product>;

@Schema({ _id: true })
export class ProductVariant {
  @Prop()
  size?: string;

  @Prop()
  color?: string;

  @Prop()
  sku?: string;

  @Prop({ default: 0 })
  stock!: number;

  @Prop({ default: true })
  active!: boolean;
}

@Schema({ _id: true })
export class ProductMedia {
  @Prop({ required: true })
  url!: string;

  @Prop()
  alt?: string;

  @Prop({ default: false })
  isPrimary?: boolean;

  @Prop()
  publicId?: string;
}

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug!: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId!: Types.ObjectId;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true, unique: true, trim: true })
  sku!: string;

  @Prop()
  brand?: string;

  @Prop({ required: true, min: 0 })
  price!: number;

  @Prop({ min: 0 })
  salePrice?: number;

  @Prop({ type: [String], default: [] })
  sizes!: string[];

  @Prop({ type: [String], default: [] })
  colors!: string[];

  @Prop({ default: 0 })
  stockTotal!: number;

  @Prop({
    default: 'inquiry_only',
    enum: ['in_stock', 'out_of_stock', 'made_to_order', 'inquiry_only'],
  })
  availability!: string;

  @Prop({ default: false })
  featured!: boolean;

  @Prop({ default: false })
  newArrival!: boolean;

  @Prop({ default: true })
  active!: boolean;

  @Prop({ type: [ProductMedia], default: [] })
  images!: ProductMedia[];

  @Prop()
  modelUrl?: string;

  @Prop({ type: [ProductVariant], default: [] })
  variants!: ProductVariant[];

  @Prop({ default: false })
  isDemo!: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ name: 'text', sku: 'text', description: 'text' });
ProductSchema.index({ categoryId: 1, active: 1, featured: 1 });
