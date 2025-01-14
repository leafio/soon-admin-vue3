import type { RgbColor } from "soon-color-mix"
import { mixRgb } from "soon-color-mix"

type HslColor = [hue: number, saturation: number, lightness: number]

export function rgbToHsl(color: RgbColor): HslColor {
  let [r, g, b] = color
  r /= 255
  g /= 255
  b /= 255
  const l = Math.max(r, g, b)
  const s = l - Math.min(r, g, b)
  const h = s ? (l === r ? (g - b) / s : l === g ? 2 + (b - r) / s : 4 + (r - g) / s) : 0
  return [60 * h < 0 ? 60 * h + 360 : 60 * h, 100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0), (100 * (2 * l - s)) / 2]
}
export function hslToRgb(color: HslColor): RgbColor {
  let [h, s, l] = color
  s /= 100
  l /= 100
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return [255 * f(0), 255 * f(8), 255 * f(4)]
}

export function hexToRgb(hex: string): [red: number, green: number, blue: number, alpha?: number] {
  let alpha = false,
    h = hex.slice(hex.startsWith("#") ? 1 : 0)
  if (h.length === 3) h = [...h].map((x) => x + x).join("")
  else if (h.length === 8) alpha = true
  const hh = parseInt(h, 16)
  const r = hh >>> (alpha ? 24 : 16)
  const g = (hh & (alpha ? 0x00ff0000 : 0x00ff00)) >>> (alpha ? 16 : 8)
  const b = (hh & (alpha ? 0x0000ff00 : 0x0000ff)) >>> (alpha ? 8 : 0)
  const a = alpha ? hh & 0x000000ff : undefined

  return [r, g, b, a]
}
