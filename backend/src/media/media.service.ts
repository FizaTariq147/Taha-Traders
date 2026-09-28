import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { MediaAsset, MediaAssetDocument } from '../common/schemas';
import { serializeDoc, serializeMany } from '../common/utils';

@Injectable()
export class MediaService {
  private cloudinaryReady = false;

  constructor(
    @InjectModel(MediaAsset.name) private readonly media: Model<MediaAssetDocument>,
    private readonly config: ConfigService,
  ) {
    const cloud = config.get<string>('CLOUDINARY_CLOUD_NAME');
    const key = config.get<string>('CLOUDINARY_API_KEY');
    const secret = config.get<string>('CLOUDINARY_API_SECRET');
    if (cloud && key && secret) {
      cloudinary.config({
        cloud_name: cloud,
        api_key: key,
        api_secret: secret,
      });
      this.cloudinaryReady = true;
    }
  }

  async list() {
    return serializeMany(await this.media.find().sort({ createdAt: -1 }));
  }

  async uploadBuffer(
    file: Express.Multer.File,
    type: 'image' | 'model' | 'banner' | 'other' = 'image',
  ) {
    const allowedImages = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
    const allowedModels = [
      'model/gltf-binary',
      'model/gltf+json',
      'application/octet-stream',
    ];
    const maxBytes = 25 * 1024 * 1024;
    if (file.size > maxBytes) {
      throw new BadRequestException('File exceeds 25MB limit');
    }

    const isModel =
      type === 'model' ||
      file.originalname.toLowerCase().endsWith('.glb') ||
      file.originalname.toLowerCase().endsWith('.gltf');

    if (isModel) {
      if (
        !allowedModels.includes(file.mimetype) &&
        !file.originalname.match(/\.(glb|gltf)$/i)
      ) {
        throw new BadRequestException('Invalid 3D model type');
      }
    } else if (!allowedImages.includes(file.mimetype)) {
      throw new BadRequestException('Invalid image type');
    }

    if (this.cloudinaryReady) {
      const folder =
        this.config.get<string>('CLOUDINARY_FOLDER') ?? 'taha-traders';
      const result = await new Promise<{
        secure_url: string;
        public_id: string;
        bytes: number;
      }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `${folder}/${isModel ? 'models' : 'images'}`,
            resource_type: isModel ? 'raw' : 'image',
          },
          (err, uploaded) => {
            if (err || !uploaded) reject(err ?? new Error('Upload failed'));
            else
              resolve({
                secure_url: uploaded.secure_url,
                public_id: uploaded.public_id,
                bytes: uploaded.bytes ?? file.size,
              });
          },
        );
        stream.end(file.buffer);
      });

      const asset = await this.media.create({
        url: result.secure_url,
        publicId: result.public_id,
        type: isModel ? 'model' : type,
        folder,
        originalName: file.originalname,
        bytes: result.bytes,
      });
      return serializeDoc(asset);
    }

    // Local demo fallback: store as data URL metadata (not for production)
    const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    const asset = await this.media.create({
      url: dataUrl,
      type: isModel ? 'model' : type,
      folder: 'local-demo',
      originalName: file.originalname,
      bytes: file.size,
    });
    return serializeDoc(asset);
  }
}
