import { reduce } from 'lodash'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useCallback, useEffect, useMemo, useRef } from 'react'

import { useGetReportingsQuery } from '../../../../api/reportingsAPI'
import { Layers } from '../../../../domain/entities/layers/constants'
import { StatusFilterEnum } from '../../../../domain/entities/reporting'
import { attachReportingFromMap } from '../../../../domain/use_cases/missions/attachReportingFromMap'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { getReportingZoneFeature } from '../../../map/layers/Reportings/reportingsGeometryHelpers'
import { reportingPinStyleFn } from '../../../map/layers/Reportings/style'

import type { BaseMapChildrenProps } from '../../../map/BaseMap'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

export function ReportingToAttachLayer({ map, mapClickEvent }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()
  const attachReportingListener = useAppSelector(state => state.attachReportingToMission.attachReportingListener)
  const attachedReportings = useAppSelector(state => state.attachReportingToMission.attachedReportings)

  const { data: reportings } = useGetReportingsQuery({
    status: [StatusFilterEnum.IN_PROGRESS]
  })

  const attachedReportingsFeatures = useMemo(
    () =>
      attachedReportings.map(reporting =>
        getReportingZoneFeature(reporting, Layers.REPORTING_TO_ATTACH_ON_MISSION.code)
      ),
    [attachedReportings]
  )
  const reportingsPointOrZone = useMemo(() => {
    const filteredReportings = reduce(
      reportings?.entities,
      (features, reporting) => {
        if (
          reporting &&
          reporting.geom &&
          (!reporting.missionId || (reporting.missionId && reporting.detachedFromMissionAtUtc))
        ) {
          features.push(getReportingZoneFeature(reporting, Layers.REPORTING_TO_ATTACH_ON_MISSION.code))
        }

        return features
      },
      [] as Feature[]
    )

    return [...filteredReportings, ...attachedReportingsFeatures]
  }, [reportings, attachedReportingsFeatures])

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
        style: reportingPinStyleFn,
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
