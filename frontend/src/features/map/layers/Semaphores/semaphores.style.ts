import { getCenter } from 'ol/extent'
import Point from 'ol/geom/Point'
import { Icon, Style } from 'ol/style'

export const sempahoreWithCentroidStyleFactory = new Style({
  geometry: feature => {
    const extent = feature?.getGeometry()?.getExtent()
    const center = extent && getCenter(extent)

    return center && new Point(center)
  },
  image: new Icon({
    src: 'semaphore.svg'
  })
})
