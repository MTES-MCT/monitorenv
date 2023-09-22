import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { set } from 'lodash/fp'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import type { FiltersState } from './types'

export type MapControlUnitListDialogState = {
  filtersState: FiltersState
}

const INITIAL_STATE: MapControlUnitListDialogState = {
  filtersState: {}
}

const persistConfig = {
  key: 'mapControlUnitListDialog',
  storage
}

const mapControlUnitListDialog = createSlice({
  initialState: INITIAL_STATE,
  name: 'mapControlUnitListDialog',
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

export const mapControlUnitListDialogActions = mapControlUnitListDialog.actions

export const mapControlUnitListDialogPersistedReducer = persistReducer(persistConfig, mapControlUnitListDialog.reducer)
