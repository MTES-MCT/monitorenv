import { createSlice } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import type { Semaphore } from '../entities/semaphore'

const persistConfig = {
  blacklist: ['overlayPosition', 'selectedSemaphoreId'],
  key: 'semaphores',
  storage
}

type SemaphoresState = {
  overlayPosition: [number, number] | undefined
  registeredSemaphores: Semaphore[]
  selectedSemaphoreId: number | undefined
}

const INITIAL_STATE: SemaphoresState = {
  overlayPosition: undefined,
  registeredSemaphores: [],
  selectedSemaphoreId: undefined
}

const semaphoresSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'semaphoresState',
  reducers: {
    addSemaphore(state, action: any) {
      if (state.registeredSemaphores.length === 4) {
        state.registeredSemaphores.shift()
      }
      if (!state.registeredSemaphores.find(registeredSemaphore => registeredSemaphore.id === action.payload.id)) {
        state.registeredSemaphores.push(action.payload)
      }
    },
    resetSelectedSemaphore(state) {
      state.selectedSemaphoreId = undefined
    },
    setOverlayPosition(state, action) {
      state.overlayPosition = action.payload
    },
    setSelectedSemaphore(state, action) {
      state.selectedSemaphoreId = action.payload
    }
  }
})

export const { addSemaphore, resetSelectedSemaphore, setOverlayPosition, setSelectedSemaphore } =
  semaphoresSlice.actions

export const semaphoresPersistedReducer = persistReducer(persistConfig, semaphoresSlice.reducer)
