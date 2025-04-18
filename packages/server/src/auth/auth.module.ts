import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersModule } from "../users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { JWT } from "./auth.constants";
import { GrpcAuthGuard } from "./grpc-auth.guard";

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: JWT.secret,
      signOptions: { expiresIn: "1h" },
    }),
  ],
  providers: [AuthService, GrpcAuthGuard],
  controllers: [AuthController],
  exports: [AuthService, GrpcAuthGuard],
})
export class AuthModule {}
