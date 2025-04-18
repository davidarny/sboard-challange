import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { env } from "./env";
import { Logger } from "@nestjs/common";
import type { MicroserviceOptions } from "@nestjs/microservices";
import { Transport } from "@nestjs/microservices";
import { join } from "node:path";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: "image",
      protoPath: join(__dirname, "image/image.proto"),
      url: `0.0.0.0:${env.PORT + 1}`,
    },
  });

  await app.startAllMicroservices();
  Logger.log(`gRPC microservice is running on port ${env.PORT + 1}`, "NestApplication");

  await app.listen(env.PORT);
  Logger.log(`HTTP server is running on port ${env.PORT}`, "NestApplication");
}

bootstrap().catch(console.error);
