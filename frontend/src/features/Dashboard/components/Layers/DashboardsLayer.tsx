import { useGetFilteredDashboardsQuery } from '@features/Dashboard/hooks/useGetFilteredDashboardsQuery'
import { selectDashboardOnMap } from '@features/Dashboard/useCases/selectDashboardOnMap'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useHasMapInteraction } from '@hooks/useHasMapInteraction'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { Layers } from 'domain/entities/layers/constants'
import { convertToFeature } from 'domain/types/map'
import { Feature } from 'ol'
import { getCenter } from 'ol/extent'
import { GeoJSON as OLGeoJSON } from 'ol/format'
import { Point, type Geometry } from 'ol/geom'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Icon, Style } from 'ol/style'
import { useEffect, useRef, type MutableRefObject } from 'react'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'

export function DashboardsLayer({ map, mapClickEvent }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()
  const displayDashboardLayer = useAppSelector(state => state.global.layers.displayDashboardLayer)
  const hasMapInteraction = useHasMapInteraction()
  const isLayerVisible = displayDashboardLayer && !hasMapInteraction

  const { dashboards } = useGetFilteredDashboardsQuery()

  const dashboardsVectorSourceRef = useRef(new VectorSource()) as MutableRefObject<VectorSource<Feature<Geometry>>>
  const dashboardsVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: dashboardsVectorSourceRef.current,
      style: dashboardIcon,
      zIndex: Layers.DASHBOARDS.zIndex
    })
  ) as MutableRefObject<VectorLayerWithName>
  dashboardsVectorLayerRef.current.name = Layers.DASHBOARDS.code
  useEffect(() => {
    if (map) {
      map.getLayers().push(dashboardsVectorLayerRef.current)

      // eslint-disable-next-line react-hooks/exhaustive-deps
      return () => map.removeLayer(dashboardsVectorLayerRef.current)
    }

    return () => {}
  }, [map])

  useEffect(() => {
    dashboardsVectorSourceRef.current?.clear(true)
    if (dashboards) {
      const dashboardsFeatures = dashboards.map(dashboard => {
        const geoJSON = new OLGeoJSON()
        const geometry = geoJSON.readGeometry(dashboard.geom, {
          dataProjection: WSG84_PROJECTION,
          featureProjection: OPENLAYERS_PROJECTION
        })
        const feature = new Feature({ geometry })
        feature.setId(`${Layers.DASHBOARDS.code}:${dashboard.id}`)
        feature.setProperties({ dashboard })

        return feature
      })

      dashboardsVectorSourceRef.current?.addFeatures(dashboardsFeatures)
    }
  }, [dashboards])

  useEffect(() => {
    dashboardsVectorLayerRef.current?.setVisible(isLayerVisible)
  }, [isLayerVisible])

  useEffect(() => {
    const feature = convertToFeature(mapClickEvent?.feature)
    if (feature) {
      if (feature.getId()?.toString()?.includes(Layers.DASHBOARDS.code)) {
        dispatch(selectDashboardOnMap(feature.getProperties().dashboard))
      }
    }
  }, [dispatch, mapClickEvent])
}

const dashboardIcon = () => [
  new Style({
    geometry: feature => {
      const extent = feature?.getGeometry()?.getExtent()
      const center = extent && getCenter(extent)

      return center && new Point(center)
    },
    image: new Icon({
      src: 'icons/bullseye_border.svg'
    })
  })
]
