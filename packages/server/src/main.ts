import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { env } from "./env";
import { Logger } from "@nestjs/common";
import type { MicroserviceOptions } from "@nestjs/microservices";
import { Transport } from "@nestjs/microservices";
import { join } from "node:path";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: "image",
      protoPath: join(__dirname, "image/image.proto"),
      url: `0.0.0.0:${env.PORT}`,
    },
  });

  await app.startAllMicroservices();
  Logger.log(`gRPC microservice is running on port ${env.PORT}`, "NestApplication");

  await app.listen(env.PORT);
}

bootstrap().catch(console.error);
