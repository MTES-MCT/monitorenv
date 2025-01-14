import { getReportingZoneFeature } from '@features/Reportings/components/ReportingLayer/Reporting/reportingsGeometryHelpers'
import { reportingPinStyleFn } from '@features/Reportings/components/ReportingLayer/Reporting/style'
import { Layers } from 'domain/entities/layers/constants'
import { StatusFilterEnum } from 'domain/entities/reporting'
import { convertToFeature } from 'domain/types/map'
import { reduce } from 'lodash'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useEffect, useMemo, useRef } from 'react'

import { useGetReportingsQuery } from '../../../../../api/reportingsAPI'
import { useAppDispatch } from '../../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../../hooks/useAppSelector'
import { attachReportingFromMap } from '../../../useCases/attachReportingFromMap'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

export function ReportingToAttachLayer({ map, mapClickEvent }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()
  const isReportingAttachmentInProgress = useAppSelector(
    state => state.attachReportingToMission.isReportingAttachmentInProgress
  )
  const attachedReportings = useAppSelector(state => state.attachReportingToMission.attachedReportings)

  const { data: reportings } = useGetReportingsQuery(
    {
      status: [StatusFilterEnum.IN_PROGRESS]
    },
    { skip: !isReportingAttachmentInProgress }
  )

  const attachedReportingsFeatures = useMemo(
    () =>
      attachedReportings.map(reporting =>
        getReportingZoneFeature(reporting, Layers.REPORTING_TO_ATTACH_ON_MISSION.code)
      ),
    [attachedReportings]
  )

  const filteredReportings = useMemo(
    () =>
      reduce(
        reportings?.entities,
        (features, reporting) => {
          if (
            reporting.geom &&
            reporting.isControlRequired &&
            (!reporting.missionId || (reporting.missionId && reporting.detachedFromMissionAtUtc))
          ) {
            features.push(getReportingZoneFeature(reporting, Layers.REPORTING_TO_ATTACH_ON_MISSION.code))
          }

          return features
        },
        [] as Feature[]
      ),
    [reportings?.entities]
  )

  const reportingsPointOrZone = useMemo(
    () => [...filteredReportings, ...attachedReportingsFeatures],
    [filteredReportings, attachedReportingsFeatures]
  )

  const vectorSourceRef = useRef(new VectorSource()) as React.MutableRefObject<VectorSource<Feature<Geometry>>>

  const vectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: vectorSourceRef.current,
      style: reportingPinStyleFn,
      zIndex: Layers.REPORTING_TO_ATTACH_ON_MISSION.zIndex
    })
  ) as React.MutableRefObject<VectorLayerWithName>
  vectorLayerRef.current.name = Layers.REPORTING_TO_ATTACH_ON_MISSION.code

  useEffect(() => {
    map.getLayers().push(vectorLayerRef.current)

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      map.removeLayer(vectorLayerRef.current)
    }
  }, [map])

  useEffect(() => {
    vectorSourceRef.current?.clear(true)
    if (reportingsPointOrZone) {
      vectorSourceRef.current?.addFeatures(reportingsPointOrZone)
    }
  }, [reportingsPointOrZone])

  useEffect(() => {
    vectorLayerRef.current?.setVisible(isReportingAttachmentInProgress)
  }, [isReportingAttachmentInProgress])

  useEffect(() => {
    const feature = convertToFeature(mapClickEvent?.feature)
    if (feature?.getId()?.toString()?.includes(Layers.REPORTING_TO_ATTACH_ON_MISSION.code)) {
      const { id } = feature.getProperties()
      dispatch(attachReportingFromMap(id))
    }
  }, [dispatch, mapClickEvent])

  return null
}
