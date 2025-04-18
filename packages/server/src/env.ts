import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

import { expand } from "dotenv-expand";
import { config } from "dotenv";

expand(config());

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
  },

  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  skipValidation: process.env.SKIP_VALIDATION === "true",
});
