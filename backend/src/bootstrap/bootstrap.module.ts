import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/user.schema';
import { Product, ProductSchema } from '../products/product.schema';
import {
  Category,
  CategorySchema,
  Settings,
  SettingsSchema,
  ContentBlocks,
  ContentBlocksSchema,
} from '../common/schemas';
import { BootstrapService } from './bootstrap.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Settings.name, schema: SettingsSchema },
      { name: ContentBlocks.name, schema: ContentBlocksSchema },
    ]),
  ],
  providers: [BootstrapService],
})
export class BootstrapModule {}
