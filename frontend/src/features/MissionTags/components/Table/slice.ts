import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { set } from 'lodash/fp'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import type { FiltersState } from './types'

interface MissionTagTableState {
  filtersState: FiltersState
}

const INITIAL_STATE: MissionTagTableState = {
  filtersState: {}
}

const persistConfig = {
  key: 'missionTagTable',
  storage
}

const tagTableSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'missionTagTable',
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

export const missionTagTableActions = tagTableSlice.actions

export const missiontagTablePersistedReducer = persistReducer(persistConfig, tagTableSlice.reducer)
