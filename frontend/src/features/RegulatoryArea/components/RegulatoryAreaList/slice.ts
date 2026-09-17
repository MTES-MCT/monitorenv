import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { set } from 'lodash/fp'

import type { TagOption } from 'domain/entities/tags'
import type { ThemeOption } from 'domain/entities/themes'

type FiltersState = {
  from?: string
  groupBy: 'CONTROL_PLAN' | 'SEA_FRONT'
  period?: '1_MONTH' | '6_MONTHS' | 'ONE_YEAR' | 'CUSTOM'
  regHelper?: 'WITHOUT_THEME' | 'WITHOUT_TAG' | 'OUTDATED'
  seaFronts?: string[]
  searchQuery?: string
  sortBy?: 'ALPHA_ASC' | 'CREATE_ASC' | 'CREATE_DESC'
  tags?: TagOption[]
  themes?: ThemeOption[]
  to?: string
}

interface RegulatoryAreaTableState {
  filtersState: FiltersState
  openedRegulatoryAreaId: number | undefined
}

const INITIAL_STATE: RegulatoryAreaTableState = {
  filtersState: {
    from: undefined,
    groupBy: 'CONTROL_PLAN',
    period: undefined,
    regHelper: undefined,
    seaFronts: undefined,
    searchQuery: undefined,
    sortBy: undefined,
    tags: undefined,
    themes: undefined,
    to: undefined
  },
  openedRegulatoryAreaId: undefined
}

const regulatoryAreaTableSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'regulatoryAreaTable',
  reducers: {
    resetFilters(state) {
      state.filtersState = {
        ...INITIAL_STATE.filtersState,
        groupBy: state.filtersState.groupBy,
        sortBy: state.filtersState.sortBy
      }
    },
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
