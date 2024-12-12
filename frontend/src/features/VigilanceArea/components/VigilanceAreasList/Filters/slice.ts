import { VigilanceArea } from '@features/VigilanceArea/types'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'vigilanceAreaFilters',
  storage
}

type VigilanceAreaSliceState = {
  createdBy: string[]
  seaFronts: string[]
  searchQuery: string | undefined
  status: VigilanceArea.Status[]
}
const INITIAL_STATE: VigilanceAreaSliceState = {
  createdBy: [],
  seaFronts: [],
  searchQuery: undefined,
  status: [VigilanceArea.Status.DRAFT, VigilanceArea.Status.PUBLISHED]
}
export const vigilanceAreaFiltersSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'vigilanceAreaFilters',
  reducers: {
    resetFilters: () => INITIAL_STATE,
    setCreatedBy: (state, action: PayloadAction<string[]>) => {
      state.createdBy = action.payload
    },
    setSeaFronts: (state, action: PayloadAction<string[]>) => {
      state.seaFronts = action.payload
    },
    setSearchQueryFilter: (state, action: PayloadAction<string | undefined>) => {
      state.searchQuery = action.payload
    },
    setStatus: (state, action: PayloadAction<VigilanceArea.Status[]>) => {
      state.status = action.payload
    },
    updateFilters: (state, action) => {
      state[action.payload.key] = action.payload.value
    }
  }
})

export const vigilanceAreaFiltersActions = vigilanceAreaFiltersSlice.actions
export const vigilanceAreaFiltersPersistedReducer = persistReducer(persistConfig, vigilanceAreaFiltersSlice.reducer)
