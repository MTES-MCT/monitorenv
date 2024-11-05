import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { ReportingDateRangeEnum } from 'domain/entities/dateRange'
import { StatusFilterEnum } from 'domain/entities/reporting'
import { set } from 'lodash'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import type { VigilanceArea } from '@features/VigilanceArea/types'
import type { DateAsStringRange } from '@mtes-mct/monitor-ui'

const persistConfig = {
  key: 'dashboardFilters',
  storage
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

export type DashboardFiltersType = {
  controlUnitFilters: ControlUnitFilters
  filters: DashboardFilters
  reportingFilters: ReportingFilters
}

type DashboardFiltersState = {
  dashboards: {
    [key: string]: DashboardFiltersType
  }
}
const INITIAL_STATE: DashboardFiltersState = {
  dashboards: {}
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
        reportingFilters: {
          dateRange: ReportingDateRangeEnum.MONTH,
          status: [StatusFilterEnum.IN_PROGRESS]
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
        reportingFilters: {
          dateRange: ReportingDateRangeEnum.MONTH,
          status: [StatusFilterEnum.IN_PROGRESS]
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
    setReportingFilters(state, action: PayloadAction<{ filters: Partial<ReportingFilters>; id: string | undefined }>) {
      const { filters, id } = action.payload
      if (!id) {
        return
      }
      if (state.dashboards[id]) {
        const { reportingFilters } = state.dashboards[id]
        state.dashboards[id].reportingFilters = { ...reportingFilters, ...filters }
      }
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

export const dashboardFiltersActions = dashboardFiltersSlice.actions
export const dashboardFiltersPersistedReducer = persistReducer(persistConfig, dashboardFiltersSlice.reducer)
