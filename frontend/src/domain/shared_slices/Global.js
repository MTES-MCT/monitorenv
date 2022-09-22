import { createSlice } from '@reduxjs/toolkit'

/* eslint-disable */
/** @namespace GlobalReducer */
const GlobalReducer = null
/* eslint-enable */

const globalSlice = createSlice({
  initialState: {
    // state entry for every component displayed on map whose visibility should be controlled
    // state entry for every layer whose visibility should be controlled
    displayDrawLayerModal: false,

    displayEditingMissionLayer: true,

    displayInterestPoint: true,

    displayLayersSidebar: true,

    displayLocateOnMap: true,

    displayMeasurement: true,

    displayMissionsLayer: true,

    displayMissionsMenu: true,

    displayMissionsOverlay: true,

    displaySelectedMissionLayer: true,

    error: null,

    /** @type {string | null} healthcheckTextWarning */
    healthcheckTextWarning: null,

    openedSideWindowTab: null,
    rightMenuIsOpen: false,
    sideWindowIsOpen: false
  },
  name: 'global',
  reducers: {
    /**
     * Close side window
     * @function closeSideWindow
     * @memberOf GlobalReducer
     * @param {Object=} state
     */
    closeSideWindow(state) {
      state.openedSideWindowTab = null
      state.sideWindowIsOpen = false
    },

    contractRightMenu(state) {
      state.rightMenuIsOpen = false
    },

    expandRightMenu(state) {
      state.rightMenuIsOpen = true
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

    removeError(state) {
      state.error = null
    },

    setDisplayedItems(state, action) {
      return { ...state, ...action.payload }
    },

    setError(state, action) {
      state.error = action.payload
    },

    /**
     * Set warning to show on application header
     * @param {Object} state
     * @param {{payload: string | null}} action - the warning(s) or null if no warning are found
     */
    setHealthcheckTextWarning(state, action) {
      state.healthcheckTextWarning = action.payload
    },
    /**
     * Set the side window as open
     * @function setSideWindowAsOpen
     * @memberOf GlobalReducer
     * @param {Object=} state
     */
    setSideWindowAsOpen(state) {
      state.sideWindowIsOpen = true
    }
  }
})

export const {
  closeSideWindow,
  contractRightMenu,
  expandRightMenu,
  openSideWindowTab,
  removeError,
  setDisplayedItems,
  setError,
  setHealthcheckTextWarning,
  setSideWindowAsOpen
} = globalSlice.actions

export default globalSlice.reducer
