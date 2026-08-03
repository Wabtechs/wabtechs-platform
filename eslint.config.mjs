import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "_backup-old-site/**",
    "_backup-old-Dashboard/**",
  ]),
  {
    rules: {
      // Downgrade to warning: legitimate data-loading-on-mount patterns
      // (localStorage read, fetch-in-effect) are flagged as errors by this rule.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
