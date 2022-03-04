import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import { homeReducers } from './domain/shared_slices'

const homeStore = configureStore({
  reducer: homeReducers,
  middleware: [thunk]
})

export { homeStore }
