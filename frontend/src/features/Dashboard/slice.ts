import { getFilterVigilanceAreasPerPeriod } from '@features/layersSelector/utils/getFilteredVigilanceAreasPerPeriod'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { type DateAsStringRange } from '@mtes-mct/monitor-ui'
import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { isGeometryValid } from '@utils/geometryValidation'
import { ReportingDateRangeEnum } from 'domain/entities/dateRange'
import { InteractionType } from 'domain/entities/map/constants'
import { StatusFilterEnum, type Reporting } from 'domain/entities/reporting'
import { set } from 'lodash'

import { Dashboard } from './types'
import { filter } from './useCases/filterReportings'

import type { GeoJSON } from 'domain/types/GeoJSON'

const initialDashboard: DashboardType = {
  ampIdsToDisplay: [],
  controlUnitFilters: {},
  dashboard: {
    amps: [],
    controlUnits: [],
    geom: undefined,
    id: '',
    name: '',
    regulatoryAreas: [],
    reportings: [],
    vigilanceAreas: []
  },
  defaultName: '',
  extractedArea: undefined,
  filters: {},
  isBannerDisplayed: false,
  openPanel: undefined,
  regulatoryIdsToDisplay: [],
  reportingFilters: { dateRange: ReportingDateRangeEnum.MONTH, status: [StatusFilterEnum.IN_PROGRESS] },
  reportingToDisplay: undefined
}

type OpenPanel = {
  id: number
  subPanel?: OpenPanel
  type: Dashboard.Block
}

type ReportingFilters = {
  dateRange: ReportingDateRangeEnum
  period?: DateAsStringRange
  status: StatusFilterEnum[]
}

export type ControlUnitFilters = {
  administrationId?: number
  query?: string
  stationId?: number
  type?: string
}

type DashboardFilters = {
  amps?: string[]
  previewSelection?: boolean
  regulatoryThemes?: string[]
  specificPeriod?: DateAsStringRange | undefined
  vigilanceAreaPeriod?: VigilanceArea.VigilanceAreaFilterPeriod | undefined
}

export type DashboardType = {
  ampIdsToDisplay: number[]
  controlUnitFilters: ControlUnitFilters
  dashboard: Dashboard.Dashboard
  defaultName: string | undefined
  extractedArea?: Dashboard.ExtractedArea
  filters: DashboardFilters
  isBannerDisplayed: boolean
  openPanel: OpenPanel | undefined
  regulatoryIdsToDisplay: number[]
  reportingFilters: ReportingFilters
  reportingToDisplay: Reporting | undefined
}

type SelectedDashboardType = {
  [key: string]: DashboardType
}

type DashboardState = {
  activeDashboardId: string | undefined
  dashboards: SelectedDashboardType
  expandedAccordionFirstColumn: Dashboard.Block | undefined
  expandedAccordionSecondColumn: Dashboard.Block | undefined
  expandedAccordionThirdColumn: Dashboard.Block | undefined
  geometry: GeoJSON.Geometry | undefined
  initialGeometry: GeoJSON.Geometry | undefined
  interactionType: InteractionType
  isDrawing: boolean
  isGeometryValid: boolean
}

const INITIAL_STATE: DashboardState = {
  activeDashboardId: undefined,
  dashboards: {},
  expandedAccordionFirstColumn: undefined,
  expandedAccordionSecondColumn: undefined,
  expandedAccordionThirdColumn: undefined,
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
        switch (type) {
          case Dashboard.Block.AMP:
            state.dashboards[id].dashboard.amps = [...state.dashboards[id].dashboard.amps, ...itemIds]
            break
          case Dashboard.Block.CONTROL_UNITS:
            state.dashboards[id].dashboard.controlUnits = [...state.dashboards[id].dashboard.controlUnits, ...itemIds]
            break
          case Dashboard.Block.REGULATORY_AREAS:
            state.dashboards[id].dashboard.regulatoryAreas = [
              ...state.dashboards[id].dashboard.regulatoryAreas,
              ...itemIds
            ]
            break
          case Dashboard.Block.VIGILANCE_AREAS:
            state.dashboards[id].dashboard.vigilanceAreas = [
              ...state.dashboards[id].dashboard.vigilanceAreas,
              ...itemIds
            ]
            break
          case Dashboard.Block.REPORTINGS:
          case Dashboard.Block.COMMENTS:
          case Dashboard.Block.TERRITORIAL_PRESSURE:
          default:
        }
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
        const selectedReportings = state.dashboards[id].dashboard.reportings
        state.dashboards[id].dashboard.reportings = [...selectedReportings, reporting]
      }
    },

    createDashboard(
      state,
      action: PayloadAction<{
        dashboard: Dashboard.Dashboard
        defaultName: string
        extractedArea: Dashboard.ExtractedArea
      }>
    ) {
      state.activeDashboardId = action.payload.dashboard.id

      state.dashboards[action.payload.dashboard.id] = {
        ...initialDashboard,
        dashboard: action.payload.dashboard,
        defaultName: action.payload.defaultName,
        extractedArea: action.payload.extractedArea
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
        switch (type) {
          case Dashboard.Block.AMP:
            state.dashboards[id].dashboard.amps = state.dashboards[id].dashboard.amps.filter(
              item => !itemIds.includes(item)
            )
            break
          case Dashboard.Block.CONTROL_UNITS:
            state.dashboards[id].dashboard.controlUnits = state.dashboards[id].dashboard.controlUnits.filter(
              item => !itemIds.includes(item)
            )
            break
          case Dashboard.Block.REGULATORY_AREAS:
            state.dashboards[id].dashboard.regulatoryAreas = state.dashboards[id].dashboard.regulatoryAreas.filter(
              item => !itemIds.includes(item)
            )
            break
          case Dashboard.Block.VIGILANCE_AREAS:
            state.dashboards[id].dashboard.vigilanceAreas = state.dashboards[id].dashboard.vigilanceAreas.filter(
              item => !itemIds.includes(item)
            )
            break
          case Dashboard.Block.REPORTINGS:
          case Dashboard.Block.COMMENTS:
          case Dashboard.Block.TERRITORIAL_PRESSURE:
          default:
        }
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
        const selectedReportings = state.dashboards[id].dashboard.reportings
        state.dashboards[id].dashboard.reportings = selectedReportings.filter(
          selectedReporting => selectedReporting.id !== reporting.id
        )
      }
    },
    removeTab(state, action: PayloadAction<string>) {
      const dashboard = state.dashboards[action.payload]
      if (dashboard) {
        delete state.dashboards[action.payload]
      }
    },
    resetDashboardFilters(state) {
      const id = state.activeDashboardId

      if (!id || !state.dashboards[id]) {
        return
      }

      state.dashboards[id].filters = {}
    },
    setActiveDashboardId(state, action: PayloadAction<string | undefined>) {
      state.activeDashboardId = action.payload
    },
    setBanner(state, action: PayloadAction<boolean>) {
      const id = state.activeDashboardId

      if (!id || !state.dashboards[id]) {
        return
      }
      state.dashboards[id].isBannerDisplayed = action.payload
    },
    setComments(state, action: PayloadAction<string | undefined>) {
      const id = state.activeDashboardId

      if (!id || !state.dashboards[id]) {
        return
      }

      state.dashboards[id].dashboard.comments = action.payload
    },
    setControlUnitsFilters(
      state,
      action: PayloadAction<{
        key: keyof ControlUnitFilters
        value: any
      }>
    ) {
      const id = state.activeDashboardId

      if (!id || !state.dashboards[id]) {
        return
      }

      state.dashboards[id].controlUnitFilters = set(
        state.dashboards[id].controlUnitFilters,
        action.payload.key,
        action.payload.value
      )
    },
    setDashboardFilters(state, action: PayloadAction<DashboardFilters>) {
      const id = state.activeDashboardId

      if (!id || !state.dashboards[id]) {
        return
      }
      state.dashboards[id].filters = { ...state.dashboards[id].filters, ...action.payload }
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
    setName(state, action: PayloadAction<string>) {
      const id = state.activeDashboardId

      if (!id || !state.dashboards[id]) {
        return
      }

      state.dashboards[id].dashboard.name = action.payload
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
        state.dashboards[id].reportingToDisplay = action.payload
      }
    },
    updateDashboard(state, action: PayloadAction<{ dashboard: Dashboard.DashboardFromApi }>) {
      const { activeDashboardId } = state

      if (activeDashboardId) {
        const dashboard = state.dashboards[activeDashboardId]
        if (dashboard) {
          const reportings = dashboard.extractedArea?.reportings
          const dashboardToUpdate: Dashboard.Dashboard = {
            ...action.payload.dashboard,
            reportings:
              reportings?.filter(reporting => action.payload.dashboard.reportings.includes(+reporting.id)) ?? []
          }

          state.dashboards = {
            ...state.dashboards,
            [activeDashboardId]: { ...dashboard, dashboard: dashboardToUpdate }
          }
        }
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
  [(state: DashboardState) => state.dashboards, (state: DashboardState) => state.activeDashboardId],
  (dashboards, activeDashboardId) => {
    if (!activeDashboardId) {
      return undefined
    }

    if (dashboards[activeDashboardId]) {
      const filters = dashboards[activeDashboardId].reportingFilters
      const reportings = dashboards[activeDashboardId].extractedArea?.reportings

      return reportings?.filter(reporting => filter(reporting, filters))
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

export const getReportingToDisplay = createSelector(
  [(state: DashboardState) => state.dashboards, (state: DashboardState) => state.activeDashboardId],
  (dashboards, activeDashboardId) => {
    if (!activeDashboardId) {
      return undefined
    }

    return dashboards?.[activeDashboardId]?.reportingToDisplay
  }
)

export const getFilteredRegulatoryAreas = createSelector(
  [(state: DashboardState) => state.dashboards, (state: DashboardState) => state.activeDashboardId],
  (dashboards, activeDashboardId) => {
    if (!activeDashboardId) {
      return undefined
    }

    if (dashboards[activeDashboardId]) {
      const regulatoryThemesFilter = dashboards[activeDashboardId].filters.regulatoryThemes
      const regulatoryAreas = dashboards[activeDashboardId].extractedArea?.regulatoryAreas

      if (!regulatoryThemesFilter || regulatoryThemesFilter.length === 0) {
        return regulatoryAreas
      }

      return regulatoryAreas?.filter(({ thematique }) => regulatoryThemesFilter?.includes(thematique))
    }

    return undefined
  }
)

export const getFilteredAmps = createSelector(
  [(state: DashboardState) => state.dashboards, (state: DashboardState) => state.activeDashboardId],
  (dashboards, activeDashboardId) => {
    if (!activeDashboardId) {
      return undefined
    }

    if (dashboards[activeDashboardId]) {
      const ampsFilter = dashboards[activeDashboardId].filters.amps
      const amps = dashboards[activeDashboardId].extractedArea?.amps

      if (!ampsFilter || ampsFilter.length === 0) {
        return amps
      }

      return amps?.filter(({ type }) => type && ampsFilter?.includes(type))
    }

    return undefined
  }
)

export const getFilteredVigilanceAreas = createSelector(
  [(state: DashboardState) => state.dashboards, (state: DashboardState) => state.activeDashboardId],
  (dashboards, activeDashboardId) => {
    if (!activeDashboardId) {
      return undefined
    }

    if (dashboards[activeDashboardId]) {
      const periodFilter = dashboards[activeDashboardId].filters.vigilanceAreaPeriod
      const specificPeriodFilter = dashboards[activeDashboardId].filters.specificPeriod
      const vigilanceAreas = dashboards[activeDashboardId].extractedArea?.vigilanceAreas

      if (
        !periodFilter ||
        (periodFilter === VigilanceArea.VigilanceAreaFilterPeriod.SPECIFIC_PERIOD && !specificPeriodFilter)
      ) {
        return vigilanceAreas
      }

      return getFilterVigilanceAreasPerPeriod(vigilanceAreas, periodFilter, specificPeriodFilter)
    }

    return undefined
  }
)

export const dashboardActions = dashboardSlice.actions
export const dashboardReducer = dashboardSlice.reducer
