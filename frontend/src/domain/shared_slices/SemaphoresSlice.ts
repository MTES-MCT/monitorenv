import { createSlice } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import type { Semaphore } from '../entities/semaphore'

const persistConfig = {
  blacklist: ['selectedSemaphoreId', 'isSemaphoreHighlight'],
  key: 'semaphores',
  storage
}

type SemaphoresState = {
  isSemaphoreHighlight: boolean
  selectedSemaphoreId: number | undefined
  semaphoresResearchHistory: Semaphore[]
}

const INITIAL_STATE: SemaphoresState = {
  isSemaphoreHighlight: false,
  selectedSemaphoreId: undefined,
  semaphoresResearchHistory: []
}

const semaphoresSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'semaphoresSlice',
  reducers: {
    addSemaphore(state, action: any) {
      if (state.semaphoresResearchHistory.length === 5) {
        state.semaphoresResearchHistory.shift()
      }
      if (!state.semaphoresResearchHistory.find(registeredSemaphore => registeredSemaphore.id === action.payload.id)) {
        state.semaphoresResearchHistory.push(action.payload)
      }
    },
    resetSelectedSemaphore(state) {
      state.selectedSemaphoreId = undefined
    },
    setIsSemaphoreHighlight(state, action) {
      state.isSemaphoreHighlight = action.payload
    },
    setSelectedSemaphore(state, action) {
      state.selectedSemaphoreId = action.payload
    }
  }
})

export const { addSemaphore, resetSelectedSemaphore, setIsSemaphoreHighlight, setSelectedSemaphore } =
  semaphoresSlice.actions

export const semaphoresPersistedReducer = persistReducer(persistConfig, semaphoresSlice.reducer)
