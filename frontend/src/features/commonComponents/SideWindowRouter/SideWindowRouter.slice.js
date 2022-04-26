import { createSlice } from '@reduxjs/toolkit'

/* eslint-disable */
/** @namespace SideWindowRouterReducer */
const SideWindowReducerReducer = null
/* eslint-enable */


const sideWindowRouterReducerSlice = createSlice({
  name: 'sideWindowRouterReducer',
  initialState: {
   sideWindowPath: '/'
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
