import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

import dotenvx from "@dotenvx/dotenvx";

dotenvx.config();
dotenvx.config({ path: ".env.local", override: true });

export const env = createEnv({
  clientPrefix: "NEST_",
  client: {},

  server: {
    PORT: z
      .string()
      .transform((val) => parseInt(val, 10))
      .pipe(z.number()),

    S3_ENDPOINT: z.string(),
    S3_BUCKET: z.string(),
    S3_ACCESS_KEY: z.string(),
    S3_SECRET_KEY: z.string(),

    DB_HOST: z.string(),
    DB_PORT: z
      .string()
      .transform((val) => parseInt(val, 10))
      .pipe(z.number()),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),

    REDIS_HOST: z.string(),
    REDIS_PORT: z
      .string()
      .transform((val) => parseInt(val, 10))
      .pipe(z.number()),
  },

  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  skipValidation: process.env.SKIP_VALIDATION === "true",
});
