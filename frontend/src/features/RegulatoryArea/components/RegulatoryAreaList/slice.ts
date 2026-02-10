import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { set } from 'lodash/fp'

import type { TagOption } from 'domain/entities/tags'
import type { ThemeOption } from 'domain/entities/themes'

type FiltersState = {
  groupBy: 'CONTROL_PLAN' | 'SEA_FRONT'
  seaFronts?: string[]
  searchQuery?: string
  tags?: TagOption[]
  themes?: ThemeOption[]
}

interface RegulatoryAreaTableState {
  filtersState: FiltersState
  openedRegulatoryAreaId: number | undefined
}

const INITIAL_STATE: RegulatoryAreaTableState = {
  filtersState: {
    groupBy: 'CONTROL_PLAN',
    seaFronts: undefined,
    searchQuery: undefined,
    tags: undefined,
    themes: undefined
  },
  openedRegulatoryAreaId: undefined
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

export const regulatoryAreaTablePersistedReducer = regulatoryAreaTableSlice.reducer
