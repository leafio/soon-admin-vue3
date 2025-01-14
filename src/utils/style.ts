export function addStyleTag(id: string, cssText: string) {
  const style = document.querySelector(`#${id}`) || document.createElement("style")
  style.id = id
  style.textContent = cssText
  document.head.appendChild(style)
}
