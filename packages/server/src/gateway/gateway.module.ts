import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ImageModule } from "../image/image.module";
import { GatewayController } from "./gateway.controller";
import { MulterModule } from "@nestjs/platform-express";

@Module({
  imports: [AuthModule, ImageModule, MulterModule.register()],
  controllers: [GatewayController],
})
export class GatewayModule {}
