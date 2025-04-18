import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Image } from "./image.entity";
import { ImageService } from "./image.service";
import { ImageController } from "./image.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([Image]), AuthModule],
  providers: [ImageService],
  controllers: [ImageController],
})
export class ImageModule {}
