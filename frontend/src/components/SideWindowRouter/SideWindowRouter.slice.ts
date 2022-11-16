import { createSlice } from '@reduxjs/toolkit'

import { sideWindowPaths } from '../../domain/entities/sideWindow'

const sideWindowRouterReducerSlice = createSlice({
  initialState: {
    openedSideWindowTab: null,
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
      state.openedSideWindowTab = null
    },

    /**
     * Open a side window tab
     * @function openSideWindowTab
     * @memberOf GlobalReducer
     * @param {Object} state
     * @param {{payload: string}} action - The tab to show, see `sideWindowMenu`
     */
    openSideWindowTab(state, action) {
      state.openedSideWindowTab = action.payload
    },

    setSideWindowPath(state, action) {
      state.openedSideWindowTab = action.payload
      state.sideWindowPath = action.payload
    }
  }
})

export const { closeSideWindow, openSideWindowTab, setSideWindowPath } = sideWindowRouterReducerSlice.actions

export const sideWindowRouterReducer = sideWindowRouterReducerSlice.reducer
