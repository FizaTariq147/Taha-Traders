import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/user.schema';
import { Product, ProductDocument } from '../products/product.schema';
import {
  Category,
  CategoryDocument,
  Settings,
  SettingsDocument,
  ContentBlocks,
  ContentBlocksDocument,
} from '../common/schemas';
import { DEMO_MEDIA } from './demo-media';

@Injectable()
export class BootstrapService implements OnModuleInit {
  private readonly logger = new Logger(BootstrapService.name);

  constructor(
    private readonly config: ConfigService,
    @InjectModel(User.name) private readonly users: Model<UserDocument>,
    @InjectModel(Category.name) private readonly categories: Model<CategoryDocument>,
    @InjectModel(Product.name) private readonly products: Model<ProductDocument>,
    @InjectModel(Settings.name) private readonly settings: Model<SettingsDocument>,
    @InjectModel(ContentBlocks.name) private readonly content: Model<ContentBlocksDocument>,
  ) {}

  async onModuleInit() {
    if (this.config.get('SEED_ON_START') !== 'true') return;
    await this.ensureAdmin();
    await this.ensureSettings();
    await this.ensureDemoCatalogue();
    await this.refreshDemoMediaAndBrand();
  }

  private async ensureAdmin() {
    const email = this.config.get<string>('ADMIN_EMAIL') ?? 'admin@tahatraders.local';
    const password = this.config.get<string>('ADMIN_PASSWORD') ?? 'ChangeMeAdmin123!';
    const existing = await this.users.findOne({ email });
    if (existing) return;
    await this.users.create({
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: 'Admin',
      active: true,
    });
    this.logger.log(`Admin user created: ${email}`);
  }

  private async ensureSettings() {
    if (!(await this.settings.findOne())) {
      await this.settings.create({});
    }
    if (!(await this.content.findOne())) {
      await this.content.create({
        heroImageUrl: DEMO_MEDIA.hero,
        aboutImageUrl: DEMO_MEDIA.about,
        aboutBody:
          'Taha Traders is a wholesale dealer based at Shop No. 14, Ganesh Mill Road, Faisalabad. We supply threads, buttons, zippers, elastic, and general tailoring material.',
      });
    }
  }

  private async refreshDemoMediaAndBrand() {
    await this.content.updateMany(
      {},
      {
        $set: {
          heroImageUrl: DEMO_MEDIA.hero,
          aboutImageUrl: DEMO_MEDIA.about,
          aboutBody: `Taha Traders is a wholesale dealer based at Shop No. 14, Ganesh Mill Road, Faisalabad. We supply threads, buttons, zippers, elastic, and general tailoring material.`,
        },
      },
    );

    for (const [slug, imageUrl] of Object.entries(DEMO_MEDIA.categories)) {
      await this.categories.updateMany(
        { slug, isDemo: true },
        { $set: { imageUrl } },
      );
    }

    for (const [sku, url] of Object.entries(DEMO_MEDIA.products)) {
      await this.products.updateMany(
        { sku, isDemo: true },
        {
          $set: {
            images: [{ url, alt: `Demo image for ${sku}`, isPrimary: true }],
          },
        },
      );
    }

    this.logger.log('Demo media refreshed from internet placeholders (English UI)');
  }

  private async ensureDemoCatalogue() {
    if ((await this.products.countDocuments()) > 0) return;

    const demoCategories = [
      {
        name: 'Threads & Spools',
        slug: 'threads-spools',
        description: 'Demo category — sewing threads and spools.',
        imageUrl: DEMO_MEDIA.categories['threads-spools'],
        sortOrder: 1,
        isDemo: true,
        active: true,
      },
      {
        name: 'Buttons',
        slug: 'buttons',
        description: 'Demo category — garment buttons.',
        imageUrl: DEMO_MEDIA.categories.buttons,
        sortOrder: 2,
        isDemo: true,
        active: true,
      },
      {
        name: 'Zippers',
        slug: 'zippers',
        description: 'Demo category — zippers in various lengths.',
        imageUrl: DEMO_MEDIA.categories.zippers,
        sortOrder: 3,
        isDemo: true,
        active: true,
      },
      {
        name: 'Elastic',
        slug: 'elastic',
        description: 'Demo category — elastic tapes and bands.',
        imageUrl: DEMO_MEDIA.categories.elastic,
        sortOrder: 4,
        isDemo: true,
        active: true,
      },
      {
        name: 'Tailoring Accessories',
        slug: 'tailoring-accessories',
        description: 'Demo category — scissors, tape, and accessories.',
        imageUrl: DEMO_MEDIA.categories['tailoring-accessories'],
        sortOrder: 5,
        isDemo: true,
        active: true,
      },
    ];

    const categoryIds: Record<string, string> = {};
    for (const cat of demoCategories) {
      const doc = await this.categories.create(cat);
      categoryIds[cat.slug] = String(doc._id);
    }

    const img = (sku: keyof typeof DEMO_MEDIA.products, alt: string) => [
      { url: DEMO_MEDIA.products[sku], alt, isPrimary: true },
    ];

    const demoProducts = [
      {
        name: 'Demo Polyester Thread Cone',
        slug: 'demo-polyester-thread-cone',
        categoryId: categoryIds['threads-spools'],
        description:
          'Demo product only. Placeholder polyester sewing thread cone for catalogue UI testing.',
        sku: 'DEMO-THR-001',
        brand: 'Demo Brand',
        price: 450,
        salePrice: 399,
        sizes: ['5000Y', '10000Y'],
        colors: ['White', 'Black', 'Navy', 'Red'],
        availability: 'inquiry_only',
        featured: true,
        newArrival: true,
        images: img('DEMO-THR-001', 'Demo thread cone'),
        variants: [
          { size: '5000Y', color: 'White', stock: 20, active: true },
          { size: '5000Y', color: 'Black', stock: 15, active: true },
        ],
      },
      {
        name: 'Demo Cotton Thread Spool',
        slug: 'demo-cotton-thread-spool',
        categoryId: categoryIds['threads-spools'],
        description: 'Demo product only. Cotton thread spool placeholder.',
        sku: 'DEMO-THR-002',
        price: 120,
        sizes: ['200Y'],
        colors: ['Beige', 'Brown'],
        availability: 'in_stock',
        featured: true,
        newArrival: false,
        images: img('DEMO-THR-002', 'Demo cotton spool'),
        variants: [{ size: '200Y', color: 'Beige', stock: 40, active: true }],
      },
      {
        name: 'Demo Shirt Button Pack',
        slug: 'demo-shirt-button-pack',
        categoryId: categoryIds['buttons'],
        description: 'Demo product only. Assorted shirt buttons placeholder.',
        sku: 'DEMO-BTN-001',
        price: 250,
        sizes: ['14L', '16L', '18L'],
        colors: ['White', 'Ivory', 'Black'],
        availability: 'in_stock',
        featured: true,
        newArrival: true,
        images: img('DEMO-BTN-001', 'Demo buttons'),
        variants: [{ size: '14L', color: 'White', stock: 50, active: true }],
      },
      {
        name: 'Demo Metal Blazer Buttons',
        slug: 'demo-metal-blazer-buttons',
        categoryId: categoryIds['buttons'],
        description: 'Demo product only. Metal blazer buttons placeholder.',
        sku: 'DEMO-BTN-002',
        price: 680,
        sizes: ['24L'],
        colors: ['Gold', 'Silver'],
        availability: 'inquiry_only',
        featured: false,
        newArrival: true,
        images: img('DEMO-BTN-002', 'Demo metal buttons'),
        variants: [{ size: '24L', color: 'Gold', stock: 12, active: true }],
      },
      {
        name: 'Demo Nylon Zipper',
        slug: 'demo-nylon-zipper',
        categoryId: categoryIds['zippers'],
        description: 'Demo product only. Nylon zipper placeholder in common lengths.',
        sku: 'DEMO-ZIP-001',
        price: 85,
        salePrice: 75,
        sizes: ['6 inch', '8 inch', '12 inch', '18 inch'],
        colors: ['Black', 'White', 'Navy'],
        availability: 'in_stock',
        featured: true,
        newArrival: false,
        images: img('DEMO-ZIP-001', 'Demo zipper'),
        variants: [{ size: '8 inch', color: 'Black', stock: 100, active: true }],
      },
      {
        name: 'Demo Invisible Zipper',
        slug: 'demo-invisible-zipper',
        categoryId: categoryIds['zippers'],
        description: 'Demo product only. Invisible zipper placeholder.',
        sku: 'DEMO-ZIP-002',
        price: 95,
        sizes: ['8 inch', '10 inch', '14 inch'],
        colors: ['Skin', 'Black'],
        availability: 'in_stock',
        featured: false,
        newArrival: true,
        images: img('DEMO-ZIP-002', 'Demo invisible zipper'),
        variants: [{ size: '10 inch', color: 'Skin', stock: 60, active: true }],
      },
      {
        name: 'Demo Waistband Elastic',
        slug: 'demo-waistband-elastic',
        categoryId: categoryIds['elastic'],
        description: 'Demo product only. Waistband elastic roll placeholder.',
        sku: 'DEMO-ELA-001',
        price: 320,
        sizes: ['1 inch', '1.5 inch', '2 inch'],
        colors: ['White', 'Black'],
        availability: 'in_stock',
        featured: true,
        newArrival: false,
        images: img('DEMO-ELA-001', 'Demo elastic'),
        variants: [{ size: '1 inch', color: 'White', stock: 35, active: true }],
      },
      {
        name: 'Demo Soft Braided Elastic',
        slug: 'demo-soft-braided-elastic',
        categoryId: categoryIds['elastic'],
        description: 'Demo product only. Soft braided elastic placeholder.',
        sku: 'DEMO-ELA-002',
        price: 210,
        sizes: ['0.25 inch', '0.5 inch'],
        colors: ['White'],
        availability: 'made_to_order',
        featured: false,
        newArrival: true,
        images: img('DEMO-ELA-002', 'Demo braided elastic'),
        variants: [{ size: '0.5 inch', color: 'White', stock: 5, active: true }],
      },
      {
        name: 'Demo Tailoring Scissors',
        slug: 'demo-tailoring-scissors',
        categoryId: categoryIds['tailoring-accessories'],
        description: 'Demo product only. Tailoring scissors placeholder.',
        sku: 'DEMO-ACC-001',
        price: 950,
        sizes: ['8 inch', '10 inch'],
        colors: ['Blue', 'Silver'],
        availability: 'inquiry_only',
        featured: true,
        newArrival: true,
        images: img('DEMO-ACC-001', 'Demo scissors'),
        variants: [{ size: '8 inch', color: 'Blue', stock: 6, active: true }],
      },
      {
        name: 'Demo Measuring Tape',
        slug: 'demo-measuring-tape',
        categoryId: categoryIds['tailoring-accessories'],
        description: 'Demo product only. Soft measuring tape placeholder.',
        sku: 'DEMO-ACC-002',
        price: 150,
        sizes: ['60 inch'],
        colors: ['Yellow', 'White'],
        availability: 'in_stock',
        featured: false,
        newArrival: false,
        images: img('DEMO-ACC-002', 'Demo measuring tape'),
        variants: [{ size: '60 inch', color: 'Yellow', stock: 70, active: true }],
      },
    ];

    for (const p of demoProducts) {
      let stockTotal = 0;
      for (const v of p.variants) stockTotal += v.stock;
      await this.products.create({ ...p, stockTotal, active: true, isDemo: true } as never);
    }

    this.logger.log('Demo catalogue seeded (isDemo=true)');
  }
}
