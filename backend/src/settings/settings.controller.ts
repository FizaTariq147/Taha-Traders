import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ContentService, SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  @Get()
  get() {
    return this.settings.get();
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  update(@Body() body: Record<string, unknown>) {
    return this.settings.update(body as never);
  }
}

@Controller('content')
export class ContentController {
  constructor(private readonly content: ContentService) {}

  @Get()
  get() {
    return this.content.get();
  }

  @Get(':page')
  getPage() {
    return this.content.get();
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  update(@Body() body: Record<string, unknown>) {
    return this.content.update(body as never);
  }
}
