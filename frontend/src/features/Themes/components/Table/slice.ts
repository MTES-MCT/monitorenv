import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { set } from 'lodash/fp'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import type { FiltersState } from './types'

interface ThemeTableState {
  filtersState: FiltersState
}

const INITIAL_STATE: ThemeTableState = {
  filtersState: {}
}

const persistConfig = {
  key: 'themeTable',
  storage
}

const themeTableSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'themeTable',
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

export const themeTableActions = themeTableSlice.actions

export const themeTablePersistedReducer = persistReducer(persistConfig, themeTableSlice.reducer)
