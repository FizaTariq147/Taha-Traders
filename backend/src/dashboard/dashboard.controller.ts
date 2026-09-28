import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductsService } from '../products/products.service';
import { CategoriesService } from '../categories/categories.service';
import { InquiriesService } from '../inquiries/inquiries.service';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly products: ProductsService,
    private readonly categories: CategoriesService,
    private readonly inquiries: InquiriesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async stats() {
    const [productCounts, categories, inquiryCounts] = await Promise.all([
      this.products.counts(),
      this.categories.countActive(),
      this.inquiries.counts(),
    ]);

    return {
      isDemoStats: true,
      totalProducts: productCounts.total,
      activeProducts: productCounts.active,
      categories,
      newInquiries: inquiryCounts.neu,
      pendingInquiries: inquiryCounts.pending,
      orders: 0,
      lowStockProducts: productCounts.lowStock,
      note: 'Demo statistics from current database — not production KPIs.',
    };
  }
}
