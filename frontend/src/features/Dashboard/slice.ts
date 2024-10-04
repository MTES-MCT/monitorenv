import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { isGeometryValid } from '@utils/geometryValidation'
import { ReportingDateRangeEnum } from 'domain/entities/dateRange'
import { InteractionType } from 'domain/entities/map/constants'
import { StatusFilterEnum, type Reporting } from 'domain/entities/reporting'

import { Dashboard } from './types'
import { filter } from './useCases/filterReportings'

import type { DateAsStringRange } from '@mtes-mct/monitor-ui'
import type { GeoJSON } from 'domain/types/GeoJSON'

type OpenPanel = {
  id: number
  subPanel?: OpenPanel
  type: Dashboard.Block
}

type ReportingFilters = {
  dateRange: ReportingDateRangeEnum
  period?: DateAsStringRange
  status: StatusFilterEnum
}

type DashboardType = {
  ampIdsToDisplay: number[]
  comments: string | undefined
  dashboard: any
  openPanel: OpenPanel | undefined
  regulatoryIdsToDisplay: number[]
  selectedReporting: Reporting | undefined
  [Dashboard.Block.REGULATORY_AREAS]: number[]
  [Dashboard.Block.VIGILANCE_AREAS]: number[]
  [Dashboard.Block.AMP]: number[]
  [Dashboard.Block.REPORTINGS]: Reporting[]
  reportingFilters: ReportingFilters
}

type SelectedDashboardType = {
  [key: string]: DashboardType
}

type DashboardState = {
  activeDashboardId: number | undefined
  dashboards: SelectedDashboardType
  extractedArea?: Dashboard.ExtractedArea
  geometry: GeoJSON.Geometry | undefined
  initialGeometry: GeoJSON.Geometry | undefined
  interactionType: InteractionType
  isDrawing: boolean
  isGeometryValid: boolean
}

const INITIAL_STATE: DashboardState = {
  activeDashboardId: 1,
  // TODO: it's just for testing to replace with undefined
  dashboards: {
    1: {
      ampIdsToDisplay: [],
      // TODO: it's just for testing to delete
      comments: undefined,
      dashboard: {},
      openPanel: undefined,
      regulatoryIdsToDisplay: [],
      [Dashboard.Block.REGULATORY_AREAS]: [],
      [Dashboard.Block.VIGILANCE_AREAS]: [],
      [Dashboard.Block.AMP]: [],
      [Dashboard.Block.REPORTINGS]: [],
      reportingFilters: { dateRange: ReportingDateRangeEnum.MONTH, status: StatusFilterEnum.IN_PROGRESS },
      selectedReporting: undefined
    }
  },

  extractedArea: undefined,

  geometry: undefined,

  initialGeometry: undefined,

  interactionType: InteractionType.CIRCLE,

  isDrawing: false,
  isGeometryValid: false
}
export const dashboardSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'dashboard',
  reducers: {
    addAmpIdToDisplay(state, action: PayloadAction<number>) {
      const id = state.activeDashboardId

      if (!id || !state.dashboards[id]) {
        return
      }

      const ampIds = state.dashboards[id]?.ampIdsToDisplay
      state.dashboards[id].ampIdsToDisplay = [...ampIds, action.payload]
    },
    addItems(state, action: PayloadAction<{ itemIds: number[]; type: Dashboard.Block }>) {
      const { itemIds, type } = action.payload
      const id = state.activeDashboardId
      if (!id) {
        return
      }

      if (state.dashboards[id]) {
        const selectedItems = state.dashboards[id][type]
        state.dashboards[id][type] = [...selectedItems, ...itemIds]
      }
    },
    addRegulatoryIdToDisplay(state, action: PayloadAction<number>) {
      const id = state.activeDashboardId

      if (!id || !state.dashboards[id]) {
        return
      }

      const regulatoryIds = state.dashboards[id]?.regulatoryIdsToDisplay
      state.dashboards[id].regulatoryIdsToDisplay = [...regulatoryIds, action.payload]
    },
    addReporting(state, action: PayloadAction<Reporting>) {
      const reporting = action.payload
      const id = state.activeDashboardId
      if (!id) {
        return
      }

      if (state.dashboards[id]) {
        const selectedReportings = state.dashboards[id][Dashboard.Block.REPORTINGS]
        state.dashboards[id][Dashboard.Block.REPORTINGS] = [...selectedReportings, reporting]
      }
    },
    removeAllPreviewedItems(state) {
      const id = state.activeDashboardId

      if (!id || !state.dashboards[id]) {
        return
      }

      state.dashboards[id].regulatoryIdsToDisplay = []
      state.dashboards[id].ampIdsToDisplay = []
    },
    removeAllRegulatoryIdToDisplay(state) {
      const id = state.activeDashboardId

      if (!id || !state.dashboards[id]) {
        return
      }

      state.dashboards[id].regulatoryIdsToDisplay = []
    },
    removeAmpIdToDisplay(state, action: PayloadAction<number>) {
      const id = state.activeDashboardId

      if (!id || !state.dashboards[id]) {
        return
      }
      const ampIds = state.dashboards[id]?.ampIdsToDisplay
      if (ampIds) {
        state.dashboards[id].ampIdsToDisplay = ampIds.filter(ampId => ampId !== action.payload)
      }
    },
    removeItems(state, action: PayloadAction<{ itemIds: number[]; type: Dashboard.Block }>) {
      const { itemIds, type } = action.payload
      const id = state.activeDashboardId

      if (!id) {
        return
      }

      if (state.dashboards[id]) {
        const selectedItems = state.dashboards[id][type]
        state.dashboards[id][type] = selectedItems.filter(item => !itemIds.includes(item))
      }
    },
    removeRegulatoryIdToDisplay(state, action: PayloadAction<number>) {
      const id = state.activeDashboardId

      if (!id || !state.dashboards[id]) {
        return
      }
      const regulatoryIds = state.dashboards[id]?.regulatoryIdsToDisplay
      if (regulatoryIds) {
        state.dashboards[id].regulatoryIdsToDisplay = regulatoryIds.filter(
          regulatoryId => regulatoryId !== action.payload
        )
      }
    },
    removeReporting(state, action: PayloadAction<Reporting>) {
      const reporting = action.payload
      const id = state.activeDashboardId

      if (!id) {
        return
      }

      if (state.dashboards[id]) {
        const selectedReportings = state.dashboards[id][Dashboard.Block.REPORTINGS]
        state.dashboards[id][Dashboard.Block.REPORTINGS] = selectedReportings.filter(
          selectedReporting => selectedReporting.id !== reporting.id
        )
      }
    },
    setComments(state, action: PayloadAction<string | undefined>) {
      const id = state.activeDashboardId

      if (!id || !state.dashboards[id]) {
        return
      }

      state.dashboards[id].comments = action.payload
    },
    setDashboardPanel(state, action: PayloadAction<OpenPanel | undefined>) {
      const id = state.activeDashboardId

      if (!id) {
        return
      }

      if (state.dashboards[id]) {
        state.dashboards[id].openPanel = action.payload
      }
    },
    setExtractedArea(state, action: PayloadAction<Dashboard.ExtractedArea>) {
      state.extractedArea = action.payload
    },
    setGeometry(state, action: PayloadAction<GeoJSON.Geometry | undefined>) {
      state.geometry = action.payload
      state.isGeometryValid = action.payload ? isGeometryValid(action.payload) : true
    },
    setInitialGeometry(state, action: PayloadAction<GeoJSON.Geometry | undefined>) {
      state.initialGeometry = action.payload
    },
    setInteractionType(state, action: PayloadAction<InteractionType>) {
      state.interactionType = action.payload
    },
    setIsDrawing(state, action: PayloadAction<boolean>) {
      state.isDrawing = action.payload
    },
    setReportingFilters(state, action: PayloadAction<Partial<ReportingFilters>>) {
      const id = state.activeDashboardId

      if (!id) {
        return
      }

      if (state.dashboards[id]) {
        const { reportingFilters } = state.dashboards[id]
        state.dashboards[id].reportingFilters = { ...reportingFilters, ...action.payload }
      }
    },
    setSelectedReporting(state, action: PayloadAction<Reporting | undefined>) {
      const id = state.activeDashboardId

      if (!id) {
        return
      }

      if (state.dashboards[id]) {
        state.dashboards[id].selectedReporting = action.payload
      }
    }
  }
})

export const getOpenedPanel = createSelector(
  [
    (state: DashboardState) => state.dashboards,
    (state: DashboardState) => state.activeDashboardId,
    (_: DashboardState, type: Dashboard.Block) => type
  ],
  (dashboards, activeDashboardId, type) => {
    if (!activeDashboardId) {
      return undefined
    }
    const openPanel = dashboards?.[activeDashboardId]?.openPanel

    return openPanel?.type === type ? openPanel : undefined
  }
)

export const getFilteredReportings = createSelector(
  [
    (state: DashboardState) => state.dashboards,
    (state: DashboardState) => state.activeDashboardId,
    (state: DashboardState) => state.extractedArea?.reportings
  ],
  (dashboards, activeDashboardId, reportings) => {
    if (!activeDashboardId) {
      return undefined
    }

    if (dashboards[activeDashboardId]) {
      const selectedReportings = reportings
      const filters = dashboards[activeDashboardId].reportingFilters

      return selectedReportings?.filter(reporting => filter(reporting, filters))
    }

    return undefined
  }
)

export const getReportingFilters = createSelector(
  [(state: DashboardState) => state.dashboards, (state: DashboardState) => state.activeDashboardId],
  (dashboards, activeDashboardId) => {
    if (!activeDashboardId) {
      return undefined
    }

    return dashboards?.[activeDashboardId]?.reportingFilters
  }
)

export const getSelectedReporting = createSelector(
  [(state: DashboardState) => state.dashboards, (state: DashboardState) => state.activeDashboardId],
  (dashboards, activeDashboardId) => {
    if (!activeDashboardId) {
      return undefined
    }

    return dashboards?.[activeDashboardId]?.selectedReporting
  }
)

export const dashboardActions = dashboardSlice.actions
export const dashboardReducer = dashboardSlice.reducer
