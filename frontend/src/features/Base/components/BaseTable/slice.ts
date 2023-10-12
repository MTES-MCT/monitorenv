import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { set } from 'lodash/fp'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import type { FiltersState } from './types'

interface BaseTableState {
  filtersState: FiltersState
}

const INITIAL_STATE: BaseTableState = {
  filtersState: {}
}

const persistConfig = {
  key: 'baseTable',
  storage
}

const baseTableSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'baseTable',
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

export const baseTableActions = baseTableSlice.actions

export const baseTablePersistedReducer = persistReducer(persistConfig, baseTableSlice.reducer)
