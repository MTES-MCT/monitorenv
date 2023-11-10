import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { set } from 'lodash/fp'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import type { FiltersState } from './types'

interface StationTableState {
  filtersState: FiltersState
}

const INITIAL_STATE: StationTableState = {
  filtersState: {}
}

const persistConfig = {
  key: 'stationTable',
  storage
}

const stationTableSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'stationTable',
  reducers: {
    setFilter(
      state,
      action: PayloadAction<{
        key: keyof FiltersState
        value: any
      }>
    ) {
      state.filtersState = set(action.payload.key, action.payload.value, state.filtersState)
    }
  }
})

export const stationTableActions = stationTableSlice.actions

export const stationTablePersistedReducer = persistReducer(persistConfig, stationTableSlice.reducer)
