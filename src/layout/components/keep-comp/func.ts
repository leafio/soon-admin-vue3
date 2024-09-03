const Iframe_MAP = new Map()

export const useMultiFrame = () => {
  function setMap(path: string, Comp: any, link?: string) {
    Iframe_MAP.set(path, { Comp, link })
  }

  function getMap(path?: string) {
    if (path) {
      return Iframe_MAP.get(path)
    }
    return [...Iframe_MAP.entries()]
  }

  function delMap(path: string) {
    Iframe_MAP.delete(path)
  }

  return {
    setMap,
    getMap,
    delMap,
    MAP: Iframe_MAP,
  }
}
