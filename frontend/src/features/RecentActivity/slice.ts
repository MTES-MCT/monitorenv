import { customDayjs } from '@mtes-mct/monitor-ui'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { RecentActivity } from './types'

export const LAST_30_DAYS = customDayjs.utc().subtract(30, 'day').toISOString()

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
  filters: {
    infractionsStatus: [
      RecentActivity.StatusFilterEnum.WITH_INFRACTION,
      RecentActivity.StatusFilterEnum.WITHOUT_INFRACTION
    ],
    periodFilter: RecentActivity.RecentActivityDateRangeEnum.THIRTY_LAST_DAYS,
    startedAfter: LAST_30_DAYS,
    startedBefore: customDayjs.utc().toISOString()
  }
}
const recentActivitySlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'recentActivity',
  reducers: {
    resetRecentActivityFilters() {
      return { ...INITIAL_STATE }
    },
    updateFilters(
      state: RecentActivityState,
      action: PayloadAction<{
        key: string
        value: RecentActivityState['filters'][keyof RecentActivityState['filters']]
      }>
    ) {
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.key]: action.payload.value
        }
      }
    }
  }
})

export const recentActivityActions = recentActivitySlice.actions
export const recentActivityPersitedReducer = persistReducer(persistConfig, recentActivitySlice.reducer)
