import {
  Controller,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import type { RequestWithUser } from "../auth/auth.guard";
import { ImageController } from "../image/image.controller";
import { Observable } from "rxjs";
import type { Express } from "express";
import type { UploadImageRequest } from "../image/image.service";

@Controller("images")
export class GatewayController {
  constructor(private readonly imageController: ImageController) {}

  @UseGuards(AuthGuard)
  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadImage(@CurrentUser() user: RequestWithUser["user"], @UploadedFile() file: Express.Multer.File) {
    const stream$ = new Observable<UploadImageRequest>((observer) => {
      observer.next({ metadata: { filename: file.originalname } });
      observer.next({ chunk: file.buffer });
      observer.complete();
    });

    await this.imageController.uploadImage(user, stream$);
    return this.imageController.getLastImage(user);
  }

  @UseGuards(AuthGuard)
  @Get("latest")
  async getLatestImage(@CurrentUser() user: RequestWithUser["user"]) {
    return this.imageController.getLastImage(user);
  }

  @UseGuards(AuthGuard)
  @Get(":id/optimized")
  getOptimized(@Param("id") id: string) {
    // TODO: implement optimized image streaming when processing is ready
    throw new HttpException(`Not implemented (image id: ${id})`, HttpStatus.NOT_IMPLEMENTED);
  }
}
