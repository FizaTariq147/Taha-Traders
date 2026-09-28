import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class VariantDto {
  @IsOptional() @IsString() size?: string;
  @IsOptional() @IsString() color?: string;
  @IsOptional() @IsString() sku?: string;
  @IsNumber() @Min(0) stock!: number;
  @IsOptional() @IsBoolean() active?: boolean;
}

export class MediaDto {
  @IsString() url!: string;
  @IsOptional() @IsString() alt?: string;
  @IsOptional() @IsBoolean() isPrimary?: boolean;
  @IsOptional() @IsString() publicId?: string;
}

export class CreateProductDto {
  @IsString() name!: string;
  @IsOptional() @IsString() slug?: string;
  @IsMongoId() categoryId!: string;
  @IsString() description!: string;
  @IsString() sku!: string;
  @IsOptional() @IsString() brand?: string;
  @IsNumber() @Min(0) price!: number;
  @IsOptional() @IsNumber() @Min(0) salePrice?: number;
  @IsOptional() @IsArray() @IsString({ each: true }) sizes?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) colors?: string[];
  @IsOptional() @IsNumber() stockTotal?: number;
  @IsOptional()
  @IsEnum(['in_stock', 'out_of_stock', 'made_to_order', 'inquiry_only'])
  availability?: string;
  @IsOptional() @IsBoolean() featured?: boolean;
  @IsOptional() @IsBoolean() newArrival?: boolean;
  @IsOptional() @IsBoolean() active?: boolean;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => MediaDto)
  images?: MediaDto[];
  @IsOptional() @IsString() modelUrl?: string;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => VariantDto)
  variants?: VariantDto[];
  @IsOptional() @IsBoolean() isDemo?: boolean;
}

export class UpdateProductDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsMongoId() categoryId?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() sku?: string;
  @IsOptional() @IsString() brand?: string;
  @IsOptional() @IsNumber() @Min(0) price?: number;
  @IsOptional() @IsNumber() @Min(0) salePrice?: number;
  @IsOptional() @IsArray() @IsString({ each: true }) sizes?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) colors?: string[];
  @IsOptional() @IsNumber() stockTotal?: number;
  @IsOptional()
  @IsEnum(['in_stock', 'out_of_stock', 'made_to_order', 'inquiry_only'])
  availability?: string;
  @IsOptional() @IsBoolean() featured?: boolean;
  @IsOptional() @IsBoolean() newArrival?: boolean;
  @IsOptional() @IsBoolean() active?: boolean;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => MediaDto)
  images?: MediaDto[];
  @IsOptional() @IsString() modelUrl?: string;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => VariantDto)
  variants?: VariantDto[];
  @IsOptional() @IsBoolean() isDemo?: boolean;
}

export class CreateCategoryDto {
  @IsString() name!: string;
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsNumber() sortOrder?: number;
  @IsOptional() @IsBoolean() active?: boolean;
  @IsOptional() @IsBoolean() isDemo?: boolean;
}

export class UpdateCategoryDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsNumber() sortOrder?: number;
  @IsOptional() @IsBoolean() active?: boolean;
  @IsOptional() @IsBoolean() isDemo?: boolean;
}

export class CreateInquiryDto {
  @IsString() customerName!: string;
  @IsString() phone!: string;
  @IsOptional() @IsMongoId() productId?: string;
  @IsOptional() @IsString() productName?: string;
  @IsOptional() @IsString() size?: string;
  @IsOptional() @IsString() color?: string;
  @IsOptional() @IsNumber() @Min(1) quantity?: number;
  @IsString() message!: string;
}

export class UpdateInquiryStatusDto {
  @IsEnum(['new', 'contacted', 'confirmed', 'processing', 'completed', 'cancelled'])
  status!: string;
}
