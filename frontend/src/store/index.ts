import { type AnyAction, type ThunkAction, configureStore, isPlain } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist'

import { homeMiddlewares, homeReducers } from './reducers'
import { monitorenvPrivateApi, monitorenvPublicApi } from '../api/api'
import { regulatoryActionSanitizer } from '../domain/shared_slices/Regulatory'

const homeStore = configureStore({
  devTools: {
    actionSanitizer: regulatoryActionSanitizer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: {
        ignoredPaths: ['regulatory', 'layerSearch']
      },
      // TODO Create a Redux middleware to properly serialize/deserialize `Date`, `Error` objects into plain objects.
      // https://redux-toolkit.js.org/api/serializabilityMiddleware
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, 'regulatory/setRegulatoryLayers'],
        ignoredPaths: ['regulatory', 'layerSearch'],
        isSerializable: (value: any) => isPlain(value) || value instanceof Date || value instanceof Error
      }
    }).concat(homeMiddlewares as any, monitorenvPrivateApi.middleware, monitorenvPublicApi.middleware),
  reducer: homeReducers
})

setupListeners(homeStore.dispatch)

export { homeStore }

// https://react-redux.js.org/using-react-redux/usage-with-typescript#define-root-state-and-dispatch-types
// Infer the `RootState` and `AppDispatch` types from the store itself
export type HomeRootState = ReturnType<typeof homeStore.getState>
// Inferred type: { global: GlobalState, ... }
export type AppDispatch = typeof homeStore.dispatch
export type AppGetState = typeof homeStore.getState
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, HomeRootState, undefined, AnyAction>
