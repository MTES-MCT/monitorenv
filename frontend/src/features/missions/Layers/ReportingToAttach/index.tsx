import { reduce } from 'lodash'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useDispatch } from 'react-redux'

import { reportingToAttachStyle } from './style'
import { useGetReportingsQuery } from '../../../../api/reportingsAPI'
import { Layers } from '../../../../domain/entities/layers/constants'
import { StatusFilterEnum } from '../../../../domain/entities/reporting'
import { attachReportingFromMap } from '../../../../domain/use_cases/missions/attachReportingFromMap'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { getReportingZoneFeature } from '../../../map/layers/Reportings/reportingsGeometryHelpers'

import type { BaseMapChildrenProps } from '../../../map/BaseMap'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

export function ReportingToAttachLayer({ map, mapClickEvent }: BaseMapChildrenProps) {
  const dispatch = useDispatch()
  const attachReportingListener = useAppSelector(state => state.attachReportingToMission.attachReportingListener)
  const { data: reportings } = useGetReportingsQuery({
    status: [StatusFilterEnum.IN_PROGRESS]
  })

  const reportingsPointOrZone = useMemo(
    () =>
      reduce(
        reportings?.entities,
        (features, reporting) => {
          if (reporting && reporting.geom) {
            features.push(getReportingZoneFeature(reporting, Layers.REPORTING_TO_ATTACH_ON_MISSION.code))
          }

          return features
        },
        [] as Feature[]
      ),
    [reportings]
  )

  const vectorSourceRef = useRef() as React.MutableRefObject<VectorSource<Geometry>>
  const GetVectorSource = () => {
    if (vectorSourceRef.current === undefined) {
      vectorSourceRef.current = new VectorSource()
    }

    return vectorSourceRef.current
  }

  const vectorLayerRef = useRef() as React.MutableRefObject<VectorLayer<VectorSource> & { name?: string }>
  const GetVectorLayer = useCallback(() => {
    if (vectorLayerRef.current === undefined) {
      vectorLayerRef.current = new VectorLayer({
        renderBuffer: 7,
        source: GetVectorSource(),
        style: reportingToAttachStyle,
        updateWhileAnimating: true,
        updateWhileInteracting: true,
        zIndex: Layers.REPORTING_TO_ATTACH_ON_MISSION.zIndex
      })
      vectorLayerRef.current.name = Layers.REPORTING_TO_ATTACH_ON_MISSION.code
    }

    return vectorLayerRef.current
  }, [])

  useEffect(() => {
    if (map) {
      map.getLayers().push(GetVectorLayer())

      return () => map.removeLayer(GetVectorLayer())
    }

    return () => {}
  }, [map, GetVectorLayer])

  useEffect(() => {
    GetVectorSource()?.clear(true)
    if (reportingsPointOrZone) {
      GetVectorSource()?.addFeatures(reportingsPointOrZone)
    }
  }, [reportingsPointOrZone])

  useEffect(() => {
    GetVectorLayer()?.setVisible(attachReportingListener)
  }, [attachReportingListener, GetVectorLayer])

  useEffect(() => {
    if (mapClickEvent?.feature) {
      const feature = mapClickEvent?.feature
      if (feature.getId()?.toString()?.includes(Layers.REPORTING_TO_ATTACH_ON_MISSION.code)) {
        const { id } = feature.getProperties()
        dispatch(attachReportingFromMap(id))
      }
    }
  }, [dispatch, mapClickEvent])

  return null
}
