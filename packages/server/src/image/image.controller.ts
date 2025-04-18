import { Controller, UseGuards } from "@nestjs/common";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { ImageService, UploadImageRequest, UploadImageResponse, ImageInfoResponse } from "./image.service";
import { GrpcAuthGuard, RequestWithUser } from "../auth/grpc-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";

@UseGuards(GrpcAuthGuard)
@Controller()
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @GrpcStreamMethod("ImageService", "UploadImage")
  uploadImage(
    @CurrentUser() user: RequestWithUser["user"],
    stream$: Observable<UploadImageRequest>,
  ): Promise<UploadImageResponse> {
    return this.imageService.uploadImage(user.sub, stream$);
  }

  @GrpcMethod("ImageService", "GetLastImage")
  getLastImage(@CurrentUser() user: RequestWithUser["user"]): Promise<ImageInfoResponse> {
    return this.imageService.getLastImage(user.sub);
  }
}
