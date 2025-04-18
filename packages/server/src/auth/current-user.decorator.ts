import type { ExecutionContext } from "@nestjs/common";
import { createParamDecorator } from "@nestjs/common";
import type { Metadata } from "@grpc/grpc-js";
import type { RequestWithUser } from "./grpc-auth.guard";

export const CurrentUser = createParamDecorator((_: unknown, context: ExecutionContext) => {
  const type = context.getType<"http" | "rpc">();

  if (type === "http") {
    const req = context.switchToHttp().getRequest<RequestWithUser>();
    return req.user;
  }

  const metadata: Metadata = context.switchToRpc().getContext();
  const userJson = metadata.get("user").at(0);

  return typeof userJson === "string" ? (JSON.parse(userJson) as RequestWithUser["user"]) : undefined;
});
