import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { ProductsModule } from '../products/products.module';
import { CategoriesModule } from '../categories/categories.module';
import { InquiriesModule } from '../inquiries/inquiries.module';

@Module({
  imports: [ProductsModule, CategoriesModule, InquiriesModule],
  controllers: [DashboardController],
})
export class DashboardModule {}
