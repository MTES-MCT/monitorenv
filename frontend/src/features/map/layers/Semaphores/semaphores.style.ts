import { Icon, Style } from 'ol/style'

export const semaphoreStyle = new Style({
  geometry: feature => feature.getGeometry(),
  image: new Icon({
    src: 'semaphore.svg'
  })
})
