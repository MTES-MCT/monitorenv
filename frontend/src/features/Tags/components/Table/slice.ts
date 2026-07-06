import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { storage } from '@store/storage'
import { set } from 'lodash/fp'
import { persistReducer } from 'redux-persist'

import type { FiltersState } from './types'

interface TagTableState {
  filtersState: FiltersState
}

const INITIAL_STATE: TagTableState = {
  filtersState: {}
}

const persistConfig = {
  key: 'tagTable',
  storage
}

const tagTableSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'tagTable',
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

export const tagTableActions = tagTableSlice.actions

export const tagTablePersistedReducer = persistReducer(persistConfig, tagTableSlice.reducer)
