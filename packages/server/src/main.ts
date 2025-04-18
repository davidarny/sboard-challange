import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { env } from "./env";
import { Logger } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  Logger.debug(`Server is running on port ${env.PORT}`);
  await app.listen(env.PORT);
}

bootstrap().catch(console.error);
