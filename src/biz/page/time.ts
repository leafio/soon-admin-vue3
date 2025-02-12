import { tLocales } from "@/i18n"
import en_datetime from "@/i18n/locales/en/datetime"
import ko_datetime from "@/i18n/locales/ko/datetime"
import zh_datetime from "@/i18n/locales/zh/datetime"
import dayjs from "dayjs"
const DatetimeFormat = "YYYY-MM-DD HH:mm:ss" as const

export const formatDateTime = (date: string | Date, fmt?: string) => {
  return dayjs(date).format(fmt ?? DatetimeFormat)
}
export const curMonth = function () {
  const start = dayjs().startOf("month").format(DatetimeFormat)
  const end = dayjs().endOf("month").format(DatetimeFormat)
  return [start, end] as [string, string]
}
export const today = function () {
  const start = dayjs().startOf("day").format(DatetimeFormat)
  const end = dayjs().endOf("day").format(DatetimeFormat)
  return [start, end]
}

export const defaultTime: [Date, Date] = [dayjs("00:00:00", "hh:mm:ss").toDate(), dayjs("23:59:59", "hh:mm:ss").toDate()]

const t = tLocales({
  zh: zh_datetime,
  en: en_datetime,
  ko: ko_datetime,
})
export const timePickerOptions = computed(() => ({
  shortcuts: [
    {
      text: t("yesterday"),
      value: () => {
        const start = dayjs().add(-1, "day").startOf("day").format(DatetimeFormat)
        const end = dayjs().add(-1, "day").endOf("day").format(DatetimeFormat)
        return [start, end]
      },
    },
    {
      text: t("today"),
      value: () => {
        const start = dayjs().startOf("day").format(DatetimeFormat)
        const end = dayjs().endOf("day").format(DatetimeFormat)
        return [start, end]
      },
    },
    {
      text: t("lastWeek"),
      value: () => {
        const start = dayjs().add(-7, "day").startOf("week").add(1, "day").startOf("day").format(DatetimeFormat)
        const end = dayjs().add(-7, "day").endOf("week").add(1, "day").endOf("day").format(DatetimeFormat)
        return [start, end]
      },
    },
    {
      text: t("thisWeek"),
      value: () => {
        const start = dayjs().startOf("week").add(1, "day").startOf("day").format(DatetimeFormat)
        const end = dayjs().endOf("week").add(1, "day").endOf("day").format(DatetimeFormat)
        return [start, end]
      },
    },
    {
      text: t("lastMonth"),
      value: () => {
        const start = dayjs().add(-1, "month").startOf("month").format(DatetimeFormat)
        const end = dayjs().add(-1, "month").endOf("month").format(DatetimeFormat)
        return [start, end]
      },
    },
    {
      text: t("thisMonth"),
      value: () => {
        const start = dayjs().startOf("month").format(DatetimeFormat)
        const end = dayjs().endOf("month").format(DatetimeFormat)
        return [start, end]
      },
    },
    {
      text: t("lastYear"),
      value: () => {
        const start = dayjs().add(-1, "year").startOf("year").format(DatetimeFormat)
        const end = dayjs().add(-1, "year").endOf("year").format(DatetimeFormat)
        return [start, end]
      },
    },
    {
      text: t("soFarThisYear"),
      value: () => {
        const start = dayjs().startOf("year").format(DatetimeFormat)
        const end = dayjs().endOf("day").format(DatetimeFormat)
        return [start, end]
      },
    },
  ],
}))
