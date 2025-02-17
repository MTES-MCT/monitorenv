import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { set } from 'lodash-es'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import type { FiltersState } from './types'

interface AdministrationTableState {
  filtersState: FiltersState
}

const INITIAL_STATE: AdministrationTableState = {
  filtersState: {
    isArchived: false,
    query: undefined
  }
}

const persistConfig = {
  key: 'administrationList',
  storage
}

const AdministrationTableSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'administrationList',
  reducers: {
    setFilter(
      state,
      action: PayloadAction<{
        key: keyof FiltersState
        value: any
      }>
    ) {
      state.filtersState = set(state.filtersState, action.payload.key, action.payload.value)
    }
  }
})

export const administrationTableActions = AdministrationTableSlice.actions

export const administrationTablePersistedReducer = persistReducer(persistConfig, AdministrationTableSlice.reducer)
