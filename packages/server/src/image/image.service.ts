import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Image } from "./image.entity";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "../env";
import { Observable, lastValueFrom } from "rxjs";
import { toArray } from "rxjs/operators";
import sharp from "sharp";
import { User } from "../users/user.entity";

export interface UploadImageRequest {
  metadata?: { filename: string };
  chunk?: Buffer;
}

export interface UploadImageResponse {
  id: number;
}

export interface ImageInfoResponse {
  id: number;
  originalName: string;
  path: string;
  status: string;
  width: number;
  height: number;
  uploadedAt: string;
}

@Injectable()
export class ImageService {
  private s3: S3Client;

  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
  ) {
    this.s3 = new S3Client({
      endpoint: env.S3_ENDPOINT,
      region: "us-east-1",
      credentials: {
        accessKeyId: env.S3_ACCESS_KEY,
        secretAccessKey: env.S3_SECRET_KEY,
      },
      forcePathStyle: true,
    });
  }

  async uploadImage(userId: number, stream$: Observable<UploadImageRequest>): Promise<UploadImageResponse> {
    const messages = await lastValueFrom(stream$.pipe(toArray()));
    const filename = messages.find((m) => m.metadata)?.metadata?.filename ?? "unknown";
    const chunks = messages.filter((m) => m.chunk).map((m) => m.chunk as Buffer);
    const buffer = Buffer.concat(chunks);
    const key = `images/${userId}/${Date.now()}-${filename}`;

    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: env.S3_BUCKET,
          Key: key,
          Body: buffer,
          ContentType: "application/octet-stream",
        }),
      );
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new RpcException("S3 upload failed: " + msg);
    }

    const metadataSharp = await sharp(buffer).metadata();

    const image = this.imageRepository.create({
      originalName: filename,
      path: key,
      status: "uploaded",
      width: metadataSharp.width || 0,
      height: metadataSharp.height || 0,
      user: { id: userId } as User,
    });

    const saved = await this.imageRepository.save(image);

    return { id: saved.id };
  }

  async getLastImage(userId: number): Promise<ImageInfoResponse> {
    const image = await this.imageRepository.findOne({
      where: { user: { id: userId } },
      order: { uploadedAt: "DESC" },
    });

    if (!image) {
      throw new RpcException("No images found for user");
    }

    return {
      id: image.id,
      originalName: image.originalName,
      path: image.path,
      status: image.status,
      width: image.width,
      height: image.height,
      uploadedAt: image.uploadedAt.toISOString(),
    };
  }
}
