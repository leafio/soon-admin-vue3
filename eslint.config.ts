import pluginVue from "eslint-plugin-vue"
import { configureVueProject, defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript"
import oxlint from "eslint-plugin-oxlint"
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting"

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
configureVueProject({ scriptLangs: ["ts", "tsx"] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: "app/files-to-lint",
    files: ["**/*.{ts,mts,tsx,vue}"],
  },

  {
    name: "app/files-to-ignore",
    ignores: ["**/dist/**", "**/dist-ssr/**", "**/coverage/**"],
  },

  pluginVue.configs["flat/essential"],
  vueTsConfigs.recommended,
  ...oxlint.configs["flat/recommended"],
  skipFormatting,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "vue/multi-word-component-names": "off",
      "vue/first-attribute-linebreak": "off",
      "no-async-promise-executor": "off",
      "prefer-const": [
        "error",
        {
          destructuring: "all",
        },
      ],

      // "vue/no-parsing-error": "off",
      "no-undef": "off",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
        },
      ],
    },
  },
)
