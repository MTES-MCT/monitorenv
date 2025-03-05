import { customDayjs } from '@mtes-mct/monitor-ui'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { RecentActivity } from './types'

const LAST_30_DAYS = customDayjs.utc().subtract(30, 'day').toISOString()
const CURRENT_DATE = customDayjs.utc().toISOString()

const persistConfig = {
  key: 'recentActivity',
  storage
}

export enum RecentActivityFiltersEnum {
  ADMINISTRATION_IDS = 'administrationIds',
  CONTROL_UNIT_IDS = 'controlUnitIds',
  GEOMETRY = 'geometry',
  INFRACTIONS_STATUS = 'infractionsStatus',
  PERIOD_FILTER = 'periodFilter',
  STARTED_AFTER = 'startedAfter',
  STARTED_BEFORE = 'startedBefore',
  THEME_IDS = 'themeIds'
}

export type RecentActivityState = {
  data: {
    controlUnitsWithInfraction: number
    controlUnitsWithoutInfraction: number
  }
  distinctionFilter: string
  filters: {
    administrationIds?: number[]
    controlUnitIds?: number[]
    geometry?: string
    infractionsStatus?: string[]
    periodFilter: string
    startedAfter: string
    startedBefore: string
    themeIds?: number[]
  }
}

const INITIAL_STATE: RecentActivityState = {
  data: {
    controlUnitsWithInfraction: 0,
    controlUnitsWithoutInfraction: 0
  },
  distinctionFilter: RecentActivity.DistinctionFilterEnum.WITHOUT_DISTINCTION,
  filters: {
    infractionsStatus: [
      RecentActivity.StatusFilterEnum.WITH_INFRACTION,
      RecentActivity.StatusFilterEnum.WITHOUT_INFRACTION
    ],
    periodFilter: RecentActivity.RecentActivityDateRangeEnum.THIRTY_LAST_DAYS,
    startedAfter: LAST_30_DAYS,
    startedBefore: CURRENT_DATE
  }
}
const recentActivitySlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'recentActivity',
  reducers: {
    resetRecentActivityFilters() {
      return { ...INITIAL_STATE }
    },
    updateData(state: RecentActivityState, action: PayloadAction<RecentActivityState['data']>) {
      state.data = action.payload
    },
    updateDistinctionFilter(state: RecentActivityState, action: PayloadAction<string>) {
      state.distinctionFilter = action.payload
    },
    updateFilters(
      state: RecentActivityState,
      action: PayloadAction<{
        key: string
        value: RecentActivityState['filters'][keyof RecentActivityState['filters']]
      }>
    ) {
      state.filters = {
        ...state.filters,
        [action.payload.key]: action.payload.value
      }
    }
  }
})

export const recentActivityActions = recentActivitySlice.actions
export const recentActivityPersitedReducer = persistReducer(persistConfig, recentActivitySlice.reducer)
