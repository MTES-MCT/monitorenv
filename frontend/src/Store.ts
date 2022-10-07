import { configureStore } from '@reduxjs/toolkit'

import { homeReducers, homeMiddlewares } from './domain/shared_slices'
import { regulatoryActionSanitizer } from './domain/shared_slices/Regulatory'

const homeStore = configureStore({
  devTools: {
    actionSanitizer: regulatoryActionSanitizer
  },
  middleware: homeMiddlewares,
  reducer: homeReducers
})

export { homeStore }

// https://react-redux.js.org/using-react-redux/usage-with-typescript#define-root-state-and-dispatch-types
// Infer the `RootState` and `AppDispatch` types from the store itself
export type HomeRootState = ReturnType<typeof homeStore.getState>
// Inferred type: { global: GlobalState, ... }
export type AppDispatch = typeof homeStore.dispatch
export type AppGetState = typeof homeStore.getState
