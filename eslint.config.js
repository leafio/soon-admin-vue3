import globals from "globals"
import js from "@eslint/js"
import ts from "typescript-eslint"
import vue from "eslint-plugin-vue"
import prettier from "eslint-config-prettier"

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parser: "vue-eslint-parser",
      // 优先级低于 parse 的语法解析配置
      parserOptions: {
        parser: "@typescript-eslint/parser",
        ecmaVersion: 2023,
        sourceType: "module",
        jsxPragma: "React",
        ecmaFeatures: {
          jsx: true,
        },
      },

      // processor: vue.processors[".vue"],
    },
    ignores: ["./types/auto-imports.d.ts", "./types/components.d.ts"],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...vue.configs["flat/recommended"],
  prettier,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "vue/multi-word-component-names": "off",
      "vue/first-attribute-linebreak": "off",
      "no-async-promise-executor": "off",

      // "vue/no-parsing-error": "off",
      "no-undef": "off",
    },
  },
]
