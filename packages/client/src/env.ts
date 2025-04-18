import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

import dotenvx from "@dotenvx/dotenvx";

dotenvx.config();

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {},

  server: {
    PORT: z
      .string()
      .transform((val) => parseInt(val, 10))
      .pipe(z.number()),

    API_URL: z.string().url(),
  },

  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  skipValidation: process.env.SKIP_VALIDATION === "true",
});
