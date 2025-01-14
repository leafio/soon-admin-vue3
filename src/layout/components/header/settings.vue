<template>
  <el-drawer v-model="model" :title="t('settings.title')" size="360">
    <div>
      <div class="flex justify-between">
        <span>{{ t("settings.tabbar") }}</span>
        <el-switch :model-value="!appStore.tabbar.isHide" @change="(e) => (appStore.tabbar.isHide = !e)"></el-switch>
      </div>
      <el-divider> {{ t("settings.theme") }} </el-divider>
      <div v-for="(val, key) in appStore.colors" :key="key" class="flex justify-between mb-3">
        <span>{{ t(`color.${key}`) }}</span>
        <el-color-picker
          :model-value="appStore.colors[key]"
          :predefine="colorList"
          @change="
            (e) => {
              appStore.colors[key] = e ?? DEFAULT_THEME_COLORS[key]
            }
          "
        />
      </div>
    </div>
  </el-drawer>
</template>
<script setup lang="ts">
import { tLocales } from "@/i18n"
import en_settings from "@/i18n/locales/en/settings"
import ko_settings from "@/i18n/locales/ko/settings"
import zh_settings from "@/i18n/locales/zh/settings"
import { DEFAULT_THEME_COLORS, useAppStore } from "@/store/modules/app"

const t = tLocales({ zh: zh_settings, en: en_settings, ko: ko_settings })

const colorList = ["#8c57ff", "#daa96e", "#0c819f", "#409eff", "#27ae60", "#ff5c93", "#e74c3c", "#fd726d", "#f39c12", "#9b59b6"]

const model = defineModel<boolean>({ default: false })

const appStore = useAppStore()
</script>
