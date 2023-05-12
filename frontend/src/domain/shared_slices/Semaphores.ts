import { createSlice } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'semaphores',
  storage
}

type SemaphoresState = {
  registeredSemaphores: { label: string; value: string }[]
}

const INITIAL_STATE: SemaphoresState = {
  registeredSemaphores: []
}

const semaphoresSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'semaphores',
  reducers: {
    addSemaphore(state, action: any) {
      if (state.registeredSemaphores.length === 4) {
        state.registeredSemaphores.shift()
      }
      state.registeredSemaphores.push(action.payload)
    }
  }
})

export const { addSemaphore } = semaphoresSlice.actions

export const semaphoresPersistedReducer = persistReducer(persistConfig, semaphoresSlice.reducer)
