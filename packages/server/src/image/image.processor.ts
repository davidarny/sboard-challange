import { Injectable, Logger } from "@nestjs/common";
import { Worker, Queue, Job } from "bullmq";
import IORedis from "ioredis";
import sharp from "sharp";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "../env";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Image } from "./image.entity";
import { Readable } from "stream";

@Injectable()
export class ImageProcessor {
  private readonly queue: Queue;
  private readonly s3: S3Client;
  private readonly logger = new Logger(ImageProcessor.name);

  constructor(@InjectRepository(Image) private readonly imageRepository: Repository<Image>) {
    const redisConnection = new IORedis({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      maxRetriesPerRequest: null,
    });

    this.queue = new Queue("image-processing", { connection: redisConnection });

    new Worker("image-processing", this.processJob.bind(this), {
      connection: redisConnection,
      concurrency: 2,
    });

    this.s3 = new S3Client({
      region: "us-east-1",
      forcePathStyle: true,
      endpoint: env.S3_ENDPOINT,
      credentials: {
        accessKeyId: env.S3_ACCESS_KEY,
        secretAccessKey: env.S3_SECRET_KEY,
      },
    });
  }

  async addJob(imageId: number) {
    await this.queue.add("process", { imageId });
  }

  private async processJob(job: Job<{ imageId: number }>) {
    const { imageId } = job.data;
    const image = await this.imageRepository.findOne({ where: { id: imageId } });
    if (!image) {
      this.logger.error(`Image ${imageId} not found`);
      return;
    }
    try {
      const getCommand = new GetObjectCommand({ Bucket: env.S3_BUCKET, Key: image.path });
      const getResponse = await this.s3.send(getCommand);
      const buffer = await this.streamToBuffer(getResponse.Body as Readable);

      const webpBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();
      const processedKey = image.path.replace(/^images\//, "processed/images/").replace(/\.[^/.]+$/, ".webp");

      await this.s3.send(
        new PutObjectCommand({
          Bucket: env.S3_BUCKET,
          Key: processedKey,
          Body: webpBuffer,
          ContentType: "image/webp",
        }),
      );

      image.status = "processed";
      image.path = processedKey;
      await this.imageRepository.save(image);
      this.logger.log(`Processed image ${imageId} -> ${processedKey}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.logger.error(`Failed to process image ${imageId}: ${err.message}`);
      } else {
        this.logger.error(`Failed to process image ${imageId}: ${String(err)}`);
      }
    }
  }

  private async streamToBuffer(stream: Readable) {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as Uint8Array));
    }
    return Buffer.concat(chunks);
  }
}
