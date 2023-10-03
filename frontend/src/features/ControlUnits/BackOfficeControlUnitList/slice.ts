import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { set } from 'lodash/fp'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import type { FiltersState } from './types'

export type BackOfficeControlUnitListState = {
  filtersState: FiltersState
}

const INITIAL_STATE: BackOfficeControlUnitListState = {
  filtersState: {
    administrationId: undefined,
    isArchived: false,
    query: undefined
  }
}

const persistConfig = {
  key: 'backOfficeControlUnitList',
  storage
}

const backOfficeControlUnitList = createSlice({
  initialState: INITIAL_STATE,
  name: 'backOfficeControlUnitList',
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

export const backOfficeControlUnitListActions = backOfficeControlUnitList.actions

export const backOfficeControlUnitListPersistedReducer = persistReducer(
  persistConfig,
  backOfficeControlUnitList.reducer
)
