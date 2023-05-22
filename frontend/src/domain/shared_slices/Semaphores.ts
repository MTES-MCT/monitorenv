import { createSlice } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import type { Semaphore } from '../entities/semaphore'

const persistConfig = {
  blacklist: ['selectedSemaphoreId'],
  key: 'semaphores',
  storage
}

type SemaphoresState = {
  registeredSemaphores: Semaphore[]
  selectedSemaphoreId: number | undefined
}

const INITIAL_STATE: SemaphoresState = {
  registeredSemaphores: [],
  selectedSemaphoreId: undefined
}

const semaphoresSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'semaphores',
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
    setSelectedSemaphore(state, action) {
      state.selectedSemaphoreId = action.payload
    }
  }
})

export const { addSemaphore, resetSelectedSemaphore, setSelectedSemaphore } = semaphoresSlice.actions

export const semaphoresPersistedReducer = persistReducer(persistConfig, semaphoresSlice.reducer)
