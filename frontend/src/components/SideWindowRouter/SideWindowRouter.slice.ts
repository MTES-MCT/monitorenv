import { createSlice } from '@reduxjs/toolkit'

import { sideWindowPaths } from '../../domain/entities/sideWindow'

const sideWindowRouterReducerSlice = createSlice({
  initialState: {
    sideWindowIsLoaded: false,
    sideWindowIsOpen: false,
    sideWindowPath: sideWindowPaths.MISSIONS
  },
  name: 'sideWindowRouterReducer',
  reducers: {
    /**
     * Close side window
     * @function closeSideWindow
     * @memberOf GlobalReducer
     * @param {Object=} state
     */
    closeSideWindow(state) {
      state.sideWindowIsOpen = false
      state.sideWindowIsLoaded = false
    },

    /**
     * Open a side window tab
     * @function openSideWindowTab
     * @memberOf GlobalReducer
     * @param {Object} state
     * @param {{payload: string}} action - The tab to show, see `sideWindowMenu`
     */
    openSideWindowTab(state, action) {
      state.sideWindowIsOpen = action.payload
    },

    setSideWindowAsLoaded(state) {
      state.sideWindowIsLoaded = true
    },
    setSideWindowPath(state, action) {
      state.sideWindowIsOpen = action.payload
      state.sideWindowPath = action.payload
    }
  }
})

export const { closeSideWindow, openSideWindowTab, setSideWindowAsLoaded, setSideWindowPath } =
  sideWindowRouterReducerSlice.actions

export const sideWindowRouterReducer = sideWindowRouterReducerSlice.reducer
