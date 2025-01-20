import { stationActions } from '@features/Station/slice'
import { FrontendError } from '@libs/FrontendError'
import { Layers } from 'domain/entities/layers/constants'
import { mapActions } from 'domain/shared_slices/Map'
import { createEmpty, extend } from 'ol/extent'
import { fromLonLat } from 'ol/proj'

import { addBufferToExtent } from '../utils'

import type { HomeAppThunk } from '@store/index'
import type { Station } from 'domain/entities/station'

const FIVE_SECONDS = 5000

export const centerOnStation =
  (stations: Station.Station[] | Station.StationData[]): HomeAppThunk =>
  dispatch => {
    const highlightedStationFeatureIds = stations.map(station => `${Layers.STATIONS.code}:${station.id}`)
    if (stations.length === 1) {
      const station = stations[0]
      if (!station) {
        throw new FrontendError('`station` is undefined.')
      }

      const baseCoordinate = fromLonLat([station.longitude, station.latitude])

      dispatch(mapActions.setZoomToCenter(baseCoordinate))
    } else {
      const highlightedStationsExtent = createEmpty()
      stations.forEach(station => {
        const stationCoordinate = fromLonLat([station.longitude, station.latitude])
        const stationExtent = [
          stationCoordinate[0],
          stationCoordinate[1],
          stationCoordinate[0],
          stationCoordinate[1]
        ] as number[]

        extend(highlightedStationsExtent, stationExtent)
      })

      const bufferedHighlightedStationsExtent = addBufferToExtent(highlightedStationsExtent, 0.5)

      dispatch(mapActions.setFitToExtent(bufferedHighlightedStationsExtent))
    }

    dispatch(stationActions.hightlightFeatureIds(highlightedStationFeatureIds))

    setTimeout(() => {
      dispatch(stationActions.hightlightFeatureIds([]))
    }, FIVE_SECONDS)
  }
