import { createSlice } from '@reduxjs/toolkit'
import { sideWindowPaths } from '../../domain/entities/sideWindow'

/* eslint-disable */
/** @namespace SideWindowRouterReducer */
const SideWindowReducerReducer = null
/* eslint-enable */


const sideWindowRouterReducerSlice = createSlice({
  name: 'sideWindowRouterReducer',
  initialState: {
   sideWindowPath: sideWindowPaths.MISSIONS
  },
  reducers: {
    setSideWindowPath (state, action) {
      state.sideWindowPath = action.payload
    }
  }
})

export const {
  setSideWindowPath,
} = sideWindowRouterReducerSlice.actions

export const sideWindowRouterReducer = sideWindowRouterReducerSlice.reducer;
