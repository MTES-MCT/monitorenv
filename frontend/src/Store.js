import { configureStore } from '@reduxjs/toolkit'

import { homeReducers, homeMiddlewares } from './domain/shared_slices'
import {regulatoryActionSanitizer} from './domain/shared_slices/Regulatory'

const homeStore = configureStore({
  reducer: homeReducers,
  middleware: homeMiddlewares,
  devTools: {
    actionSanitizer: regulatoryActionSanitizer,
  }
})

export { homeStore }