import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Metadata } from "@grpc/grpc-js";
import { Request } from "express";

export interface RequestWithUser extends Request {
  user: { sub: number; email: string };
}

@Injectable()
export class GrpcAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const type = context.getType<"http" | "rpc">();
    let token: string | undefined;

    if (type === "http") {
      const req = context.switchToHttp().getRequest<RequestWithUser>();
      const authHeader = req.headers.authorization;
      const isValidBearer = typeof authHeader === "string" && authHeader.startsWith("Bearer ");
      if (isValidBearer) token = authHeader.slice("Bearer ".length);
    } else {
      const metadata = context.switchToRpc().getContext<Metadata>();
      const authHeader = metadata.get("authorization").at(0);
      const isValidBearer = typeof authHeader === "string" && authHeader.startsWith("Bearer ");
      if (isValidBearer) token = authHeader.slice("Bearer ".length);
    }

    if (!token) {
      throw new UnauthorizedException();
    }

    let payload: RequestWithUser["user"];
    try {
      payload = await this.jwtService.verifyAsync<typeof payload>(token);
    } catch {
      throw new UnauthorizedException();
    }

    if (type === "http") {
      const req = context.switchToHttp().getRequest<RequestWithUser>();
      req.user = payload;
    } else {
      const metadata = context.switchToRpc().getContext<Metadata>();
      metadata.set("user", JSON.stringify(payload));
    }

    return true;
  }
}
