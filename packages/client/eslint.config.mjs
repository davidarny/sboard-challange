// @ts-check
import eslint from "@eslint/js";
import prettier from "eslint-plugin-prettier/recommended";
import tseslint from "typescript-eslint";
import hooks from "eslint-plugin-react-hooks";
import refresh from "eslint-plugin-react-refresh";
import globals from "globals";
import turbo from "eslint-config-turbo/flat";

export default tseslint.config(
  {
    ignores: ["eslint.config.mjs"],
  },
  ...turbo,
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  prettier,
  refresh.configs.recommended,
  hooks.configs["recommended-latest"],
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "react-refresh/only-export-components": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/consistent-type-imports": "error",
      "prettier/prettier": ["error", {}, { usePrettierrc: true }],
    },
  },
);
