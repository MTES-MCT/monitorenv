import { ampsAPI } from '@api/ampsAPI'
import { regulatoryLayersAPI } from '@api/regulatoryLayersAPI'
import { reportingsAPI } from '@api/reportingsAPI'
import { vigilanceAreasAPI } from '@api/vigilanceAreasAPI'
import { getAMPFeature } from '@features/map/layers/AMP/AMPGeometryHelpers'
import { getRegulatoryFeature } from '@features/map/layers/Regulatory/regulatoryGeometryHelpers'
import { getVigilanceAreaZoneFeature } from '@features/VigilanceArea/components/VigilanceAreaLayer/vigilanceAreaGeometryHelper'

import { Dashboard } from './types'

import type { VigilanceArea } from '@features/VigilanceArea/types'
import type { EntityState } from '@reduxjs/toolkit'
import type { HomeRootState } from '@store/index'
import type { AMP } from 'domain/entities/AMPs'
import type { RegulatoryLayerWithMetadata } from 'domain/entities/regulatory'
import type { Feature } from 'ol'
import type { Action } from 'redux'
import type { ThunkDispatch } from 'redux-thunk'

export const getPopulatedExtractedArea = async (
  extractedAreaFromApi: Dashboard.ExtractedAreaFromApi,
  dispatch: ThunkDispatch<HomeRootState, void, Action>
) => populateExtractAreaFromApi(dispatch, extractedAreaFromApi)

export async function populateExtractAreaFromApi(
  dispatch: ThunkDispatch<HomeRootState, void, Action>,
  extractedAreaFromApi: Dashboard.ExtractedAreaFromApi
): Promise<Dashboard.ExtractedArea> {
  const { data: regulatoryLayers } = await dispatch(regulatoryLayersAPI.endpoints.getRegulatoryLayers.initiate())
  const { data: ampLayers } = await dispatch(ampsAPI.endpoints.getAMPs.initiate())
  const { data: vigilanceAreas } = await dispatch(vigilanceAreasAPI.endpoints.getVigilanceAreas.initiate())
  const { data: reportings } = await dispatch(
    reportingsAPI.endpoints.getReportingsByIds.initiate(extractedAreaFromApi.reportingIds)
  )

  return {
    ...extractedAreaFromApi,
    amps: Object.values(ampLayers?.entities ?? []).filter(amp => extractedAreaFromApi.ampIds.includes(amp.id)),
    regulatoryAreas: Object.values(regulatoryLayers?.entities ?? []).filter(reg =>
      extractedAreaFromApi.regulatoryAreaIds.includes(reg.id)
    ),
    reportings: Object.values(reportings?.entities ?? []),
    vigilanceAreas: Object.values(vigilanceAreas?.entities ?? []).filter(vigilanceArea =>
      extractedAreaFromApi.vigilanceAreaIds.includes(vigilanceArea.id)
    )
  }
}

export const extractFeatures = (
  dashboard: Dashboard.Dashboard | undefined,
  regulatoryLayers: EntityState<RegulatoryLayerWithMetadata, number> | undefined,
  ampLayers: EntityState<AMP, number> | undefined,
  vigilanceAreas: EntityState<VigilanceArea.VigilanceAreaLayer, number> | undefined
) => {
  const allFeatures: Feature[] = []

  // RegulatoryAreas Features
  if (dashboard?.regulatoryAreaIds) {
    dashboard.regulatoryAreaIds.forEach(layerId => {
      const layer = regulatoryLayers?.entities[layerId]
      if (layer?.geom?.coordinates.length) {
        const feature = getRegulatoryFeature({
          code: Dashboard.featuresCode.DASHBOARD_REGULATORY_AREAS,
          isolatedLayer: undefined,
          layer
        })
        if (feature) {
          allFeatures.push(feature)
        }
      }
    })
  }

  // AMP Features
  if (dashboard?.ampIds) {
    dashboard.ampIds.forEach(layerId => {
      const layer = ampLayers?.entities[layerId]
      if (layer?.geom?.coordinates.length) {
        const feature = getAMPFeature({
          code: Dashboard.featuresCode.DASHBOARD_AMP,
          isolatedLayer: undefined,
          layer
        })
        if (feature) {
          allFeatures.push(feature)
        }
      }
    })
  }

  // Vigilance Areas features
  if (dashboard?.vigilanceAreaIds) {
    dashboard.vigilanceAreaIds.forEach(layerId => {
      const layer = vigilanceAreas?.entities[layerId]
      if (layer?.geom?.coordinates.length) {
        const feature = getVigilanceAreaZoneFeature(layer, Dashboard.featuresCode.DASHBOARD_VIGILANCE_AREAS, undefined)
        if (feature) {
          allFeatures.push(feature)
        }
      }
    })
  }

  return allFeatures
}
