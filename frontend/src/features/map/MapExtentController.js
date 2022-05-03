import { useEffect } from 'react'
import { useSelector } from 'react-redux'


const DEFAULT_MAP_ANIMATION_DURATION = 1000
const MAX_ZOOM_LEVEL = 14

export const MapExtentController = ({map}) => {

  const { fitToExtent, zoomToCenter } = useSelector(state => state.map)

  useEffect(()=> {
    if (fitToExtent) {
      const options = {
        duration: DEFAULT_MAP_ANIMATION_DURATION,
        maxZoom: MAX_ZOOM_LEVEL,
        padding: [30, 30, 30, 30],
      }
      map.getView().fit(fitToExtent, options)
    }
  }, [map, fitToExtent])

  useEffect(() => {
    if (zoomToCenter) {
      map.getView().animate({center: zoomToCenter})
    }
  }, [map, zoomToCenter])

return null

}