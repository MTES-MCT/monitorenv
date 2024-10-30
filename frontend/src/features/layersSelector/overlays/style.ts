import { overlayStroke } from '@features/map/overlays/style'
import { Icon, Style } from 'ol/style'

export const layerListIconStyle = resolution => [
  overlayStroke,
  new Style({ image: new Icon({ scale: 1 / resolution ** (1 / 8) + 0.4, src: 'Cursor_border.svg' }) })
]
