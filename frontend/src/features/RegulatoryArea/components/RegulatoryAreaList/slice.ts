import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { set } from 'lodash/fp'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import type { TagOption } from 'domain/entities/tags'
import type { ThemeOption } from 'domain/entities/themes'

type FiltersState = {
  groupingType: 'CONTROL_PLAN' | 'SEA_FRONT'
  query?: string
  seaFront?: string[]
  tags?: TagOption[]
  themes?: ThemeOption[]
}

interface RegulatoryAreaTableState {
  filtersState: FiltersState
  openedRegulatoryAreaId: number | undefined
}

const INITIAL_STATE: RegulatoryAreaTableState = {
  filtersState: {
    groupingType: 'CONTROL_PLAN',
    query: undefined,
    seaFront: undefined,
    tags: undefined,
    themes: undefined
  },
  openedRegulatoryAreaId: undefined
}

const persistConfig = {
  key: 'regulatoryAreaTable',
  storage
}

const regulatoryAreaTableSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'regulatoryAreaTable',
  reducers: {
    setFilter(
      state,
      action: PayloadAction<{
        key: keyof FiltersState
        value: any
      }>
    ) {
      state.filtersState = set(action.payload.key, action.payload.value, state.filtersState)
    },
    setOpenRegulatoryAreaId(state, action: PayloadAction<number | undefined>) {
      state.openedRegulatoryAreaId = action.payload
    }
  }
})

export const regulatoryAreaTableActions = regulatoryAreaTableSlice.actions

export const regulatoryAreaTablePersistedReducer = persistReducer(persistConfig, regulatoryAreaTableSlice.reducer)
