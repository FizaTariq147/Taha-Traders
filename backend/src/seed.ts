import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from './users/user.schema';
import { Product, ProductDocument } from './products/product.schema';
import {
  Category,
  CategoryDocument,
  Settings,
  SettingsDocument,
  ContentBlocks,
  ContentBlocksDocument,
} from './common/schemas';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const config = app.get(ConfigService);
  const users = app.get<Model<UserDocument>>(getModelToken(User.name));
  const categories = app.get<Model<CategoryDocument>>(getModelToken(Category.name));
  const products = app.get<Model<ProductDocument>>(getModelToken(Product.name));
  const settings = app.get<Model<SettingsDocument>>(getModelToken(Settings.name));
  const content = app.get<Model<ContentBlocksDocument>>(
    getModelToken(ContentBlocks.name),
  );

  const email = config.get<string>('ADMIN_EMAIL') ?? 'admin@tahatraders.local';
  const password = config.get<string>('ADMIN_PASSWORD') ?? 'ChangeMeAdmin123!';

  const existingAdmin = await users.findOne({ email });
  if (!existingAdmin) {
    await users.create({
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: 'Admin',
      active: true,
    });
    console.log(`Admin created: ${email}`);
  } else {
    console.log('Admin already exists');
  }

  if (!(await settings.findOne())) await settings.create({});
  if (!(await content.findOne())) await content.create({});

  const demoCategories = [
    {
      name: 'Threads & Spools',
      slug: 'threads-spools',
      description: 'Demo category — sewing threads and spools.',
      imageUrl: '/demo/cat-threads.svg',
      sortOrder: 1,
      isDemo: true,
    },
    {
      name: 'Buttons',
      slug: 'buttons',
      description: 'Demo category — garment buttons.',
      imageUrl: '/demo/cat-buttons.svg',
      sortOrder: 2,
      isDemo: true,
    },
    {
      name: 'Zippers',
      slug: 'zippers',
      description: 'Demo category — zippers in various lengths.',
      imageUrl: '/demo/cat-zippers.svg',
      sortOrder: 3,
      isDemo: true,
    },
    {
      name: 'Elastic',
      slug: 'elastic',
      description: 'Demo category — elastic tapes and bands.',
      imageUrl: '/demo/cat-elastic.svg',
      sortOrder: 4,
      isDemo: true,
    },
    {
      name: 'Tailoring Accessories',
      slug: 'tailoring-accessories',
      description: 'Demo category — scissors, tape, and accessories.',
      imageUrl: '/demo/cat-accessories.svg',
      sortOrder: 5,
      isDemo: true,
    },
  ];

  const categoryIds: Record<string, string> = {};
  for (const cat of demoCategories) {
    let doc = await categories.findOne({ slug: cat.slug });
    if (!doc) doc = await categories.create({ ...cat, active: true });
    categoryIds[cat.slug] = String(doc._id);
  }

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
      images: [
        {
          url: '/demo/product-thread.svg',
          alt: 'Demo thread cone',
          isPrimary: true,
        },
      ],
      variants: [
        { size: '5000Y', color: 'White', stock: 20, active: true, sku: 'DEMO-THR-001-W5' },
        { size: '5000Y', color: 'Black', stock: 15, active: true, sku: 'DEMO-THR-001-B5' },
        { size: '10000Y', color: 'Navy', stock: 8, active: true, sku: 'DEMO-THR-001-N10' },
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
      images: [{ url: '/demo/product-thread-2.svg', alt: 'Demo cotton spool', isPrimary: true }],
      variants: [
        { size: '200Y', color: 'Beige', stock: 40, active: true },
        { size: '200Y', color: 'Brown', stock: 25, active: true },
      ],
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
      images: [{ url: '/demo/product-buttons.svg', alt: 'Demo buttons', isPrimary: true }],
      variants: [
        { size: '14L', color: 'White', stock: 50, active: true },
        { size: '16L', color: 'Black', stock: 30, active: true },
      ],
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
      images: [{ url: '/demo/product-buttons-2.svg', alt: 'Demo metal buttons', isPrimary: true }],
      variants: [
        { size: '24L', color: 'Gold', stock: 12, active: true },
        { size: '24L', color: 'Silver', stock: 10, active: true },
      ],
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
      images: [{ url: '/demo/product-zipper.svg', alt: 'Demo zipper', isPrimary: true }],
      variants: [
        { size: '8 inch', color: 'Black', stock: 100, active: true },
        { size: '12 inch', color: 'White', stock: 80, active: true },
      ],
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
      images: [{ url: '/demo/product-zipper-2.svg', alt: 'Demo invisible zipper', isPrimary: true }],
      variants: [
        { size: '10 inch', color: 'Skin', stock: 60, active: true },
        { size: '14 inch', color: 'Black', stock: 45, active: true },
      ],
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
      images: [{ url: '/demo/product-elastic.svg', alt: 'Demo elastic', isPrimary: true }],
      variants: [
        { size: '1 inch', color: 'White', stock: 35, active: true },
        { size: '2 inch', color: 'Black', stock: 20, active: true },
      ],
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
      images: [{ url: '/demo/product-elastic-2.svg', alt: 'Demo braided elastic', isPrimary: true }],
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
      images: [{ url: '/demo/product-scissors.svg', alt: 'Demo scissors', isPrimary: true }],
      variants: [
        { size: '8 inch', color: 'Blue', stock: 6, active: true },
        { size: '10 inch', color: 'Silver', stock: 4, active: true },
      ],
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
      images: [{ url: '/demo/product-tape.svg', alt: 'Demo measuring tape', isPrimary: true }],
      variants: [
        { size: '60 inch', color: 'Yellow', stock: 70, active: true },
        { size: '60 inch', color: 'White', stock: 55, active: true },
      ],
    },
  ];

  for (const p of demoProducts) {
    const exists = await products.findOne({ sku: p.sku });
    if (exists) continue;
    let stockTotal = 0;
    for (const v of p.variants) stockTotal += v.stock;
    await products.create({
      name: p.name,
      slug: p.slug,
      categoryId: p.categoryId,
      description: p.description,
      sku: p.sku,
      brand: 'brand' in p ? (p as { brand?: string }).brand : undefined,
      price: p.price,
      salePrice: 'salePrice' in p ? (p as { salePrice?: number }).salePrice : undefined,
      sizes: p.sizes,
      colors: p.colors,
      availability: p.availability,
      featured: p.featured,
      newArrival: p.newArrival,
      images: p.images,
      variants: p.variants,
      stockTotal,
      active: true,
      isDemo: true,
    } as never);
  }

  console.log('Seed complete. Demo categories and products are labeled isDemo=true.');
  await app.close();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
