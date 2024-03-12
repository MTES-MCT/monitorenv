import { type AnyAction, type ThunkAction, configureStore, combineReducers, isPlain } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist'

import { homeReducers } from './reducers'
import { monitorenvPrivateApi, monitorenvPublicApi, geoserverApi } from '../api/api'

const homeStore = configureStore({
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      // https://redux-toolkit.js.org/api/serializabilityMiddleware
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredPaths: ['layerSearch'],
        // TODO Replace all Redux state Dates by strings & Error by a strict-typed POJO.
        isSerializable: (value: any) => isPlain(value) || value instanceof Date || value instanceof Error
      }
    }).concat(monitorenvPrivateApi.middleware, monitorenvPublicApi.middleware, geoserverApi.middleware),
  reducer: combineReducers(homeReducers) as unknown as typeof homeReducers
})

setupListeners(homeStore.dispatch)

export { homeStore }

// https://react-redux.js.org/using-react-redux/usage-with-typescript#define-root-state-and-dispatch-types
export type HomeAppDispatch = typeof homeStore.dispatch
export type HomeAppThunk<ReturnType = void> = ThunkAction<ReturnType, HomeRootState, undefined, AnyAction>
export type HomeRootState = ReturnType<typeof homeStore.getState>
