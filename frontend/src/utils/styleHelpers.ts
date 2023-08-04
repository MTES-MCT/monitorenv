export function measureScrollbarWidth() {
  const scrollbox = document.createElement('div')

  scrollbox.style.overflow = 'scroll'

  document.body.appendChild(scrollbox)

  const scrollBarWidth = scrollbox.offsetWidth - scrollbox.clientWidth

  document.documentElement.style.setProperty('--scrollbar-width', `${scrollBarWidth}px`)
  document.body.removeChild(scrollbox)
}
