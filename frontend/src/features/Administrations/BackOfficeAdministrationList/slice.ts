import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { set } from 'lodash/fp'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import type { FiltersState } from './types'

export type BackOfficeAdministrationListState = {
  filtersState: FiltersState
}

const INITIAL_STATE: BackOfficeAdministrationListState = {
  filtersState: {
    isArchived: false,
    query: undefined
  }
}

const persistConfig = {
  key: 'backOfficeAdministrationList',
  storage
}

const backOfficeAdministrationList = createSlice({
  initialState: INITIAL_STATE,
  name: 'backOfficeAdministrationList',
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

export const backOfficeAdministrationListActions = backOfficeAdministrationList.actions

export const backOfficeAdministrationListPersistedReducer = persistReducer(
  persistConfig,
  backOfficeAdministrationList.reducer
)
