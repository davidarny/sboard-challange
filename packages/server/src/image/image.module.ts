import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Image } from "./image.entity";
import { ImageService } from "./image.service";
import { ImageController } from "./image.controller";
import { AuthModule } from "../auth/auth.module";
import { ImageProcessor } from "./image.processor";

@Module({
  imports: [TypeOrmModule.forFeature([Image]), AuthModule],
  providers: [ImageService, ImageController, ImageProcessor],
  controllers: [ImageController],
  exports: [ImageController],
})
export class ImageModule {}
