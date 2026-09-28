import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Settings,
  SettingsSchema,
  ContentBlocks,
  ContentBlocksSchema,
} from '../common/schemas';
import { ContentService, SettingsService } from './settings.service';
import { ContentController, SettingsController } from './settings.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Settings.name, schema: SettingsSchema },
      { name: ContentBlocks.name, schema: ContentBlocksSchema },
    ]),
  ],
  providers: [SettingsService, ContentService],
  controllers: [SettingsController, ContentController],
  exports: [SettingsService, ContentService],
})
export class SettingsModule {}
