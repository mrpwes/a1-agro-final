import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";

export default [
  { files: ["src/**/*.{js,mjs,cjs,ts,vue}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {
    ignores: [
      "/dist",
      "/src-capacitor",
      "/src-cordova",
      "/.quasar",
      "/node_modules",
      ".eslintrc.js",
      ".eslintrc.cjs",
      "/quasar.config.*.temporary.compiled*",
    ],
  },
];
