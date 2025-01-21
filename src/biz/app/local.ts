import type { Lang } from "@/i18n"
import { createLocalStorage } from "soon-storage"

type LocalVal = {
  token?: string
  refresh_token?: string
  lang?: Lang
}

export const soon_local = createLocalStorage<LocalVal>()
