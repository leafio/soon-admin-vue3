import { obj2keyObj } from "soon-utils"

export function useKeys<T extends object>(data: T) {
  return computed(() => obj2keyObj(data))
}

// export function usePathKeyName<T extends object>(data: T) {
//   return computed(() => {
//     return object2keyPathObject(data)
//   })
// }
