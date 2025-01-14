import pinia from "@/store/instance"

import { useAppStore } from "./modules/app"
import { useKeepAliveStore } from "./modules/keepAlive"
import { useTabsStore } from "./modules/tabs"
import { useUserStore } from "./modules/user"

export function resetStore() {
  useUserStore(pinia).$reset()
  useTabsStore(pinia).$reset()
  useKeepAliveStore(pinia).$reset()
  useAppStore(pinia).$reset()
}
