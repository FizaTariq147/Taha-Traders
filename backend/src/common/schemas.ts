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

export type InquiryDocument = HydratedDocument<Inquiry>;

@Schema({ timestamps: true })
export class Inquiry {
  @Prop({ required: true, trim: true })
  customerName!: string;

  @Prop({ required: true, trim: true })
  phone!: string;

  @Prop({ type: Types.ObjectId, ref: 'Product' })
  productId?: Types.ObjectId;

  @Prop()
  productName?: string;

  @Prop()
  size?: string;

  @Prop()
  color?: string;

  @Prop({ default: 1, min: 1 })
  quantity!: number;

  @Prop({ required: true })
  message!: string;

  @Prop({
    default: 'new',
    enum: ['new', 'contacted', 'confirmed', 'processing', 'completed', 'cancelled'],
  })
  status!: string;
}

export const InquirySchema = SchemaFactory.createForClass(Inquiry);

@Schema({ timestamps: true, collection: 'settings' })
export class Settings {
  @Prop({ required: true, default: 'Taha Traders' })
  businessNameEn!: string;

  @Prop({ required: true, default: 'طاها ٹریڈرز' })
  businessNameUr!: string;

  @Prop({ default: 'Wholesale Dealer' })
  tagline!: string;

  @Prop({ type: [String], default: ['0300-7671371', '0300-8671371', '0335-4876069'] })
  phones!: string[];

  /** Digits only for wa.me — Needs confirmation */
  @Prop({ default: '03008671371' })
  whatsappNumber!: string;

  @Prop({ default: '' })
  email!: string;

  @Prop({ default: 'Shop No. 14, Ganesh Mill Road, Faisalabad' })
  address!: string;

  @Prop({ default: 'دکان نمبر 14 گنیش مل روڈ فیصل آباد' })
  addressUr!: string;

  @Prop({ default: '' })
  mapUrl!: string;

  @Prop({ default: '' })
  businessHours!: string;

  @Prop({ default: 'Mian Munim Fareed Munna' })
  proprietor!: string;

  @Prop({ default: 'Muhammad Talha' })
  contactPerson!: string;
}

export type SettingsDocument = HydratedDocument<Settings>;
export const SettingsSchema = SchemaFactory.createForClass(Settings);

@Schema({ timestamps: true, collection: 'content_blocks' })
export class ContentBlocks {
  @Prop({ default: 'Taha Traders' })
  heroTitle!: string;

  @Prop({
    default:
      'Wholesale dealer of threads, buttons, zippers, elastic, and tailoring materials in Faisalabad.',
  })
  heroSubtitle!: string;

  @Prop({
    default: 'https://picsum.photos/seed/taha-hero/1400/900',
  })
  heroImageUrl!: string;

  @Prop({ default: '' })
  heroModelUrl!: string;

  @Prop({ default: 'Shop catalogue' })
  heroCtaPrimary!: string;

  @Prop({ default: 'WhatsApp inquiry' })
  heroCtaSecondary!: string;

  @Prop({ default: 'About Taha Traders' })
  aboutTitle!: string;

  @Prop({
    default:
      'Taha Traders is a wholesale dealer based at Shop No. 14, Ganesh Mill Road, Faisalabad. We supply threads, buttons, zippers, elastic, and general tailoring material.',
  })
  aboutBody!: string;

  @Prop({
    default: 'https://picsum.photos/seed/taha-about/1200/800',
  })
  aboutImageUrl!: string;

  @Prop({
    type: [
      {
        title: String,
        body: String,
      },
    ],
    default: [
      {
        title: 'Wholesale focus',
        body: 'Built for tailors and retailers who need reliable material supply.',
      },
      {
        title: 'Clear catalogue',
        body: 'Browse categories and product details before you inquire.',
      },
      {
        title: 'WhatsApp ordering',
        body: 'Send product inquiries with size and color in one tap.',
      },
    ],
  })
  whyChooseUs!: { title: string; body: string }[];

  @Prop({ default: 'Demo catalogue — replace with your real inventory in Admin.' })
  promoBanner!: string;
}

export type ContentBlocksDocument = HydratedDocument<ContentBlocks>;
export const ContentBlocksSchema = SchemaFactory.createForClass(ContentBlocks);

@Schema({ timestamps: true })
export class MediaAsset {
  @Prop({ required: true })
  url!: string;

  @Prop()
  publicId?: string;

  @Prop({ required: true, enum: ['image', 'model', 'banner', 'other'] })
  type!: string;

  @Prop()
  folder?: string;

  @Prop()
  originalName?: string;

  @Prop({ default: 0 })
  bytes!: number;
}

export type MediaAssetDocument = HydratedDocument<MediaAsset>;
export const MediaAssetSchema = SchemaFactory.createForClass(MediaAsset);
