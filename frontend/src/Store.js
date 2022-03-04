import { configureStore } from '@reduxjs/toolkit'
import { homeReducers, homeMiddlewares } from './domain/shared_slices'

const homeStore = configureStore({
  reducer: homeReducers,
  middleware: homeMiddlewares
})

export { homeStore }