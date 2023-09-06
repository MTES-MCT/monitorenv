import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { set } from 'lodash/fp'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import type { FiltersState } from './types'

export type BackOfficeBaseListState = {
  filtersState: FiltersState
}

const INITIAL_STATE: BackOfficeBaseListState = {
  filtersState: {}
}

const persistConfig = {
  key: 'backOfficeBaseList',
  storage
}

const backOfficeBaseList = createSlice({
  initialState: INITIAL_STATE,
  name: 'backOfficeBaseList',
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

export const backOfficeBaseListActions = backOfficeBaseList.actions

export const backOfficeBaseListPersistedReducer = persistReducer(persistConfig, backOfficeBaseList.reducer)
