import { getFilterVigilanceAreasPerPeriod } from '@features/layersSelector/utils/getFilteredVigilanceAreasPerPeriod'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { isGeometryValid } from '@utils/geometryValidation'
import { InteractionType } from 'domain/entities/map/constants'
import { type Reporting } from 'domain/entities/reporting'

import { Dashboard } from './types'
import { filterReportings } from './useCases/filterReportings'

import type { GeoJSON } from 'domain/types/GeoJSON'

export const initialDashboard: DashboardType = {
  ampIdsToDisplay: [],
  dashboard: {
    ampIds: [],
    controlUnitIds: [],
    geom: undefined,
    id: '',
    name: '',
    regulatoryAreaIds: [],
    reportingIds: [],
    vigilanceAreaIds: []
  },
  defaultName: '',
  displayGeometry: true,
  extractedArea: undefined,
  isEditingTabName: false,
  openPanel: undefined,
  regulatoryIdsToDisplay: [],
  reportingToDisplay: undefined
}

type OpenPanel = {
  id: number
  subPanel?: OpenPanel
  type: Dashboard.Block
}

export type DashboardType = {
  ampIdsToDisplay: number[]
  dashboard: Dashboard.Dashboard
  defaultName: string | undefined
  displayGeometry: boolean
  extractedArea?: Dashboard.ExtractedArea
  isEditingTabName: boolean
  openPanel: OpenPanel | undefined
  regulatoryIdsToDisplay: number[]
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
  selectedDashboardOnMap: Dashboard.PopulatedDashboard | undefined
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
  isGeometryValid: false,
  selectedDashboardOnMap: undefined
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
            state.dashboards[id].dashboard.ampIds = [...state.dashboards[id].dashboard.ampIds, ...itemIds]
            break
          case Dashboard.Block.CONTROL_UNITS:
            state.dashboards[id].dashboard.controlUnitIds = [
              ...state.dashboards[id].dashboard.controlUnitIds,
              ...itemIds
            ]
            break
          case Dashboard.Block.REGULATORY_AREAS:
            state.dashboards[id].dashboard.regulatoryAreaIds = [
              ...state.dashboards[id].dashboard.regulatoryAreaIds,
              ...itemIds
            ]
            break
          case Dashboard.Block.VIGILANCE_AREAS:
            state.dashboards[id].dashboard.vigilanceAreaIds = [
              ...state.dashboards[id].dashboard.vigilanceAreaIds,
              ...itemIds
            ]
            break
          case Dashboard.Block.REPORTINGS:
            state.dashboards[id].dashboard.reportingIds = [...state.dashboards[id].dashboard.reportingIds, ...itemIds]
            break
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

    editDashboard(state, action: PayloadAction<DashboardType>) {
      const { id } = action.payload.dashboard
      if (!id) {
        return
      }
      state.dashboards[id] = action.payload
    },
    removeAllPreviewedItems(state) {
      const id = state.activeDashboardId

      if (!id || !state.dashboards[id]) {
        return
      }

      state.dashboards[id].regulatoryIdsToDisplay = []
      state.dashboards[id].ampIdsToDisplay = []
      state.dashboards[id].reportingToDisplay = undefined
      state.dashboards[id].openPanel = undefined
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
            state.dashboards[id].dashboard.ampIds = state.dashboards[id].dashboard.ampIds.filter(
              item => !itemIds.includes(item)
            )
            break
          case Dashboard.Block.CONTROL_UNITS:
            state.dashboards[id].dashboard.controlUnitIds = state.dashboards[id].dashboard.controlUnitIds.filter(
              item => !itemIds.includes(item)
            )
            break
          case Dashboard.Block.REGULATORY_AREAS:
            state.dashboards[id].dashboard.regulatoryAreaIds = state.dashboards[id].dashboard.regulatoryAreaIds.filter(
              item => !itemIds.includes(item)
            )
            break
          case Dashboard.Block.VIGILANCE_AREAS:
            state.dashboards[id].dashboard.vigilanceAreaIds = state.dashboards[id].dashboard.vigilanceAreaIds.filter(
              item => !itemIds.includes(item)
            )
            break
          case Dashboard.Block.REPORTINGS:
            state.dashboards[id].dashboard.reportingIds = state.dashboards[id].dashboard.reportingIds.filter(
              item => !itemIds.includes(item)
            )
            break
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
    removeTab(state, action: PayloadAction<string>) {
      const dashboard = state.dashboards[action.payload]
      if (dashboard) {
        delete state.dashboards[action.payload]
      }
    },
    resetDashboards() {
      return INITIAL_STATE
    },
    setActiveDashboardId(state, action: PayloadAction<string | undefined>) {
      state.activeDashboardId = action.payload
    },
    setComments(state, action: PayloadAction<{ comments: string | undefined; key: string }>) {
      const id = action.payload.key

      if (!id || !state.dashboards[id]) {
        return
      }

      state.dashboards[id].dashboard.comments = action.payload.comments
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
    setDisplayGeometry(state, action: PayloadAction<{ key: string; visible: boolean }>) {
      const id = action.payload.key

      if (!id || !state.dashboards[id]) {
        return
      }

      state.dashboards[id].displayGeometry = action.payload.visible
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
    setIsEditingTabName(state, action: PayloadAction<{ isEditing: boolean; key: string }>) {
      const id = action.payload.key

      if (!id || !state.dashboards[id]) {
        return
      }

      state.dashboards[id].isEditingTabName = action.payload.isEditing
    },
    setName(state, action: PayloadAction<{ key: string; name: string }>) {
      const id = action.payload.key

      if (!id || !state.dashboards[id]) {
        return
      }

      state.dashboards[id].dashboard.name = action.payload.name
    },
    setSelectedDashboardOnMap(state, action: PayloadAction<Dashboard.PopulatedDashboard | undefined>) {
      state.selectedDashboardOnMap = action.payload
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
    updateArea(
      state,
      action: PayloadAction<{
        dashboard: Dashboard.Dashboard
        dashboardKey: string
        extractedArea: Dashboard.ExtractedArea
      }>
    ) {
      const { dashboard, dashboardKey: id, extractedArea } = action.payload
      if (state.dashboards[id]) {
        state.dashboards[id].extractedArea = extractedArea
        state.dashboards[id].dashboard = dashboard
      }
    },
    updateDashboard(state, action: PayloadAction<{ dashboard: Dashboard.DashboardFromApi }>) {
      const { activeDashboardId } = state

      if (activeDashboardId) {
        const dashboard = state.dashboards[activeDashboardId]
        if (dashboard) {
          const dashboardToUpdate: Dashboard.Dashboard = action.payload.dashboard

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
  [
    (state: DashboardState) => state.dashboards,
    (state: DashboardState) => state.activeDashboardId,
    (_, reportingFilters) => reportingFilters
  ],
  (dashboards, activeDashboardId, reportingFilters) => {
    if (!activeDashboardId) {
      return undefined
    }

    if (dashboards[activeDashboardId]) {
      const filters = reportingFilters
      const reportings = dashboards[activeDashboardId].extractedArea?.reportings

      return reportings?.filter(reporting => filterReportings(reporting, filters))
    }

    return undefined
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
  [
    (state: DashboardState) => state.dashboards,
    (state: DashboardState) => state.activeDashboardId,
    (_, regulatoryThemesFilter) => regulatoryThemesFilter
  ],
  (dashboards, activeDashboardId, regulatoryThemesFilter) => {
    if (!activeDashboardId) {
      return undefined
    }

    if (dashboards[activeDashboardId]) {
      const regulatoryAreas = dashboards[activeDashboardId].extractedArea?.regulatoryAreas

      if (!regulatoryThemesFilter || regulatoryThemesFilter.length === 0) {
        return regulatoryAreas
      }

      return regulatoryAreas?.filter(({ thematique }) => {
        const themes = thematique.split(',').map(theme => theme.trim())

        return themes.some(theme => regulatoryThemesFilter?.includes(theme))
      })
    }

    return undefined
  }
)

export const getFilteredAmps = createSelector(
  [
    (state: DashboardState) => state.dashboards,
    (state: DashboardState) => state.activeDashboardId,
    (_, ampFilter) => ampFilter
  ],
  (dashboards, activeDashboardId, ampFilter) => {
    if (!activeDashboardId) {
      return undefined
    }

    if (dashboards[activeDashboardId]) {
      const amps = dashboards[activeDashboardId].extractedArea?.amps

      if (!ampFilter || ampFilter.length === 0) {
        return amps
      }

      return amps?.filter(({ type }) => type && ampFilter?.includes(type))
    }

    return undefined
  }
)

export const getFilteredVigilanceAreas = createSelector(
  [
    (state: DashboardState) => state.dashboards,
    (state: DashboardState) => state.activeDashboardId,
    (_, filters) => filters
  ],
  (dashboards, activeDashboardId, filters) => {
    if (!activeDashboardId) {
      return undefined
    }

    if (dashboards[activeDashboardId]) {
      const regulatoryThemesFilter = filters?.regulatoryThemes
      const periodFilter = filters?.vigilanceAreaPeriod
      const specificPeriodFilter = filters?.specificPeriod
      const vigilanceAreas = dashboards[activeDashboardId].extractedArea?.vigilanceAreas

      let filteredVigilanceAreasByThemes = vigilanceAreas

      if (regulatoryThemesFilter && regulatoryThemesFilter.length > 0) {
        filteredVigilanceAreasByThemes = vigilanceAreas?.filter(({ themes }) =>
          themes?.some(theme => regulatoryThemesFilter?.includes(theme))
        )
      }

      if (
        !periodFilter ||
        (periodFilter === VigilanceArea.VigilanceAreaFilterPeriod.SPECIFIC_PERIOD && !specificPeriodFilter)
      ) {
        return filteredVigilanceAreasByThemes
      }

      return getFilterVigilanceAreasPerPeriod(filteredVigilanceAreasByThemes, periodFilter, specificPeriodFilter)
    }

    return undefined
  }
)

export const getDashboards = (state: DashboardState) => state.dashboards
export const getActiveDashboardId = (state: DashboardState) => state.activeDashboardId

// The extra variables are accessible like so..
// We create a selector that ignores the state variable
// Returning just the passed id
const getId = (_: DashboardState, id: string | undefined) => id

export const getDashboardById = createSelector([getDashboards, getId], (dashboards, id) =>
  id ? dashboards[id] : undefined
)

export const dashboardActions = dashboardSlice.actions
export const dashboardReducer = dashboardSlice.reducer
