import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { set } from 'lodash/fp'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import type { FiltersState } from './types'

type TableRow = { depth: number; index: number; parentId?: number }

interface TagTableState {
  editingRows?: TableRow[] | undefined
  filtersState: FiltersState
}

const INITIAL_STATE: TagTableState = {
  editingRows: undefined,
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
    addEditingRow(state, action: PayloadAction<TableRow>) {
      if (!state.editingRows) {
        state.editingRows = [action.payload]
      } else {
        state.editingRows = [...state.editingRows, action.payload]
      }
    },
    removeEditingRow(state, action: PayloadAction<TableRow>) {
      if (state.editingRows) {
        state.editingRows = state.editingRows.filter(
          ({ depth, index, parentId }) =>
            index !== action.payload.index || depth !== action.payload.depth || parentId !== action.payload.parentId
        )
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
    }
  }
})

export const tagTableActions = tagTableSlice.actions

export const tagTablePersistedReducer = persistReducer(persistConfig, tagTableSlice.reducer)
