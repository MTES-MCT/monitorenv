import { RecentActivity } from '@features/RecentActivity/types'
import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { DateRangeEnum } from 'domain/entities/dateRange'
import { ReportingTypeEnum, StatusFilterEnum } from 'domain/entities/reporting'
import { set } from 'lodash'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import type { RecentActivityFiltersEnum } from '@features/RecentActivity/slice'
import type { VigilanceArea } from '@features/VigilanceArea/types'
import type { ControlUnit, DateAsStringRange } from '@mtes-mct/monitor-ui'
import type { TagAPI } from 'domain/entities/tags'

const persistConfig = {
  key: 'dashboardFilters_V2',
  storage
}

export type ReportingFilters = {
  dateRange: DateRangeEnum
  period?: DateAsStringRange
  status: StatusFilterEnum[]
  type?: string
}

export type RecentActivityFilters = {
  [RecentActivityFiltersEnum.ADMINISTRATION_IDS]?: number[]
  [RecentActivityFiltersEnum.CONTROL_UNIT_IDS]?: number[]
  [RecentActivityFiltersEnum.PERIOD_FILTER]: string
  [RecentActivityFiltersEnum.STARTED_AFTER]?: string
  [RecentActivityFiltersEnum.STARTED_BEFORE]?: string
  [RecentActivityFiltersEnum.THEME_IDS]?: number[]
}

export type ControlUnitFilters = {
  administrationId?: number
  query?: string
  stationId?: number
  type?: ControlUnit.ControlUnitResourceType
}

export type DashboardFilters = {
  amps?: string[]
  previewSelection?: boolean
  regulatoryTags?: TagAPI[]
  specificPeriod?: DateAsStringRange | undefined
  vigilanceAreaPeriod?: VigilanceArea.VigilanceAreaFilterPeriod | undefined
}

export type DashboardsListFilters = {
  controlUnits: number[]
  regulatoryTags: string[]
  seaFronts: string[]
  specificPeriod?: DateAsStringRange
  updatedAt: DateRangeEnum
}

export type DashboardFiltersType = {
  controlUnitFilters: ControlUnitFilters
  filters: DashboardFilters
  recentActivityFilters: RecentActivityFilters
  reportingFilters: ReportingFilters
}

type DashboardFiltersState = {
  dashboards: {
    [key: string]: DashboardFiltersType
  }
  filters: DashboardsListFilters
}

export const INITIAL_LIST_FILTERS_STATE: DashboardsListFilters = {
  controlUnits: [],
  regulatoryTags: [],
  seaFronts: [],
  specificPeriod: undefined,
  updatedAt: DateRangeEnum.MONTH
}

const INITIAL_STATE: DashboardFiltersState = {
  dashboards: {},
  filters: INITIAL_LIST_FILTERS_STATE
}
export const dashboardFiltersSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'dashboardFilters',
  reducers: {
    createDashboardFilters(state, action: PayloadAction<{ id: string }>) {
      const { id } = action.payload
      state.dashboards[id] = {
        controlUnitFilters: {},
        filters: {},
        recentActivityFilters: {
          periodFilter: RecentActivity.RecentActivityDateRangeEnum.SEVEN_LAST_DAYS
        },
        reportingFilters: {
          dateRange: DateRangeEnum.MONTH,
          status: [StatusFilterEnum.IN_PROGRESS],
          type: ReportingTypeEnum.INFRACTION_SUSPICION
        }
      }
    },
    deleteDashboardFilters(state, action: PayloadAction<{ id: string }>) {
      const { id } = action.payload
      delete state.dashboards[id]
    },
    resetDashboardFilters(state, action: PayloadAction<{ id: string | undefined }>) {
      const { id } = action.payload

      if (!id) {
        return
      }

      if (state.dashboards[id]) {
        state.dashboards[id].filters = {}
      }
    },
    resetFilters(state) {
      state.filters = INITIAL_LIST_FILTERS_STATE
    },
    setControlUnitsFilters(
      state,
      action: PayloadAction<{
        id: string | undefined
        key: keyof ControlUnitFilters
        value: any
      }>
    ) {
      const { id, key, value } = action.payload
      if (!id) {
        return
      }
      if (state.dashboards[id]) {
        state.dashboards[id].controlUnitFilters = set(state.dashboards[id].controlUnitFilters, key, value)
      }
    },
    setDashboardFilters(state, action: PayloadAction<{ filters: DashboardFiltersType | undefined; id: string }>) {
      const { filters, id } = action.payload
      if (!id) {
        return
      }
      state.dashboards[id] = filters ?? {
        controlUnitFilters: {},
        filters: {},
        recentActivityFilters: {
          periodFilter: RecentActivity.RecentActivityDateRangeEnum.SEVEN_LAST_DAYS
        },
        reportingFilters: {
          dateRange: DateRangeEnum.MONTH,
          status: [StatusFilterEnum.IN_PROGRESS],
          type: ReportingTypeEnum.INFRACTION_SUSPICION
        }
      }
    },
    setFilters(state, action: PayloadAction<{ filters: DashboardFilters; id: string | undefined }>) {
      const { filters, id } = action.payload
      if (!id) {
        return
      }
      if (state.dashboards[id]) {
        state.dashboards[id].filters = { ...state.dashboards[id].filters, ...filters }
      }
    },
    setListFilters(state, action: PayloadAction<Partial<DashboardsListFilters>>) {
      state.filters = { ...state.filters, ...action.payload }
    },
    setRecentActivityFilters(
      state,
      action: PayloadAction<{ filters: Partial<RecentActivityFilters>; id: string | undefined }>
    ) {
      const { filters, id } = action.payload
      if (!id) {
        return
      }
      if (state.dashboards[id]) {
        const { recentActivityFilters } = state.dashboards[id]
        state.dashboards[id].recentActivityFilters = { ...recentActivityFilters, ...filters }
      }
    },
    setReportingFilters(state, action: PayloadAction<{ filters: Partial<ReportingFilters>; id: string | undefined }>) {
      const { filters, id } = action.payload
      if (!id) {
        return
      }
      if (state.dashboards[id]) {
        const { reportingFilters } = state.dashboards[id]
        state.dashboards[id].reportingFilters = { ...reportingFilters, ...filters }
      }
    },
    updateFilters: (
      state,
      action: PayloadAction<{
        key: keyof DashboardsListFilters
        value: any
      }>
    ) => {
      state.filters[action.payload.key] = action.payload.value
    }
  }
})

export const getReportingFilters = createSelector(
  [(state: DashboardFiltersState) => state.dashboards, (_, dashboardId: string | undefined) => dashboardId],
  (dashboards, dashboardId) => {
    if (!dashboardId) {
      return undefined
    }

    return dashboards?.[dashboardId]?.reportingFilters
  }
)

export const getRecentActivityFilters = createSelector(
  [(state: DashboardFiltersState) => state.dashboards, (_, dashboardId: string | undefined) => dashboardId],
  (dashboards, dashboardId) => {
    if (!dashboardId) {
      return undefined
    }

    return dashboards?.[dashboardId]?.recentActivityFilters
  }
)

export const dashboardFiltersActions = dashboardFiltersSlice.actions
export const dashboardFiltersPersistedReducer = persistReducer(persistConfig, dashboardFiltersSlice.reducer)
