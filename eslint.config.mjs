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
    // Generated artifacts:
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
  ]),
  {
    rules: {
      // Downgrade to warning: legitimate data-loading-on-mount patterns
      // (localStorage read, fetch-in-effect) are flagged as errors by this rule.
      "react-hooks/set-state-in-effect": "warn",
      // TanStack Table `useReactTable()` returns functions that cannot be
      // memoized by the React Compiler; React Compiler is not enabled in
      // next.config.ts, so this rule only produces noise.
      "react-hooks/incompatible-library": "off",
    },
  },
]);

export default eslintConfig;
