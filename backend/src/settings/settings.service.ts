import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Settings,
  SettingsDocument,
  ContentBlocks,
  ContentBlocksDocument,
} from '../common/schemas';
import { serializeDoc } from '../common/utils';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Settings.name) private readonly settings: Model<SettingsDocument>,
  ) {}

  async get() {
    let doc = await this.settings.findOne();
    if (!doc) doc = await this.settings.create({});
    return serializeDoc(doc);
  }

  async update(body: Partial<Settings>) {
    let doc = await this.settings.findOne();
    if (!doc) doc = await this.settings.create(body);
    else {
      Object.assign(doc, body);
      await doc.save();
    }
    return serializeDoc(doc);
  }
}

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(ContentBlocks.name)
    private readonly content: Model<ContentBlocksDocument>,
  ) {}

  async get() {
    let doc = await this.content.findOne();
    if (!doc) doc = await this.content.create({});
    return serializeDoc(doc);
  }

  async update(body: Partial<ContentBlocks>) {
    let doc = await this.content.findOne();
    if (!doc) doc = await this.content.create(body);
    else {
      Object.assign(doc, body);
      await doc.save();
    }
    return serializeDoc(doc);
  }
}
