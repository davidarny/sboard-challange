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
  },

  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  skipValidation: process.env.SKIP_VALIDATION === "true",
});
