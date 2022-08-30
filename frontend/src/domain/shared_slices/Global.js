import { createSlice } from '@reduxjs/toolkit'

/* eslint-disable */
/** @namespace GlobalReducer */
const GlobalReducer = null
/* eslint-enable */

const globalSlice = createSlice({
  name: 'global',
  initialState: {
    error: null,
    rightMenuIsOpen: false,
    /** @type {string | null} healthcheckTextWarning */
    healthcheckTextWarning: null,
    openedSideWindowTab: null,
    sideWindowIsOpen: false,
    // state entry for every component displayed on map whose visibility should be controlled
    displayLayersSidebar: true,
    displayMissionsMenu: true,
    displayMissionsOverlay: true,
    displayMeasurement: true,
    displayLocateOnMap: true,
    displayInterestPoint: true,
    displayDrawLayerModal: false,
    // state entry for every layer whose visibility should be controlled
    displayMissionsLayer: true,
    displaySelectedMissionLayer: true,
    displayEditingMissionLayer: true,
  },
  reducers: {
    expandRightMenu (state) {
      state.rightMenuIsOpen = true
    },
    contractRightMenu (state) {
      state.rightMenuIsOpen = false
    },
    setError (state, action) {
      state.error = action.payload
    },
    removeError (state) {
      state.error = null
    },
    /**
     * Open a side window tab
     * @function openSideWindowTab
     * @memberOf GlobalReducer
     * @param {Object=} state
     * @param {{payload: string}} action - The tab to show, see `sideWindowMenu`
     */
     openSideWindowTab (state, action) {
      state.openedSideWindowTab = action.payload
    },
    /**
     * Close side window
     * @function closeSideWindow
     * @memberOf GlobalReducer
     * @param {Object=} state
     */
    closeSideWindow (state) {
      state.openedSideWindowTab = null
      state.sideWindowIsOpen = false
    },
    /**
     * Set the side window as open
     * @function setSideWindowAsOpen
     * @memberOf GlobalReducer
     * @param {Object=} state
     */
    setSideWindowAsOpen (state) {
      state.sideWindowIsOpen = true
    },
    /**
     * Set warning to show on application header
     * @param {Object=} state
     * @param {{payload: string | null}} action - the warning(s) or null if no warning are found
     */
    setHealthcheckTextWarning (state, action) {
      state.healthcheckTextWarning = action.payload
    },
    setDisplayedItems (state, action) {
      return  {...state, ...action.payload}
    }
  }
})

export const {
  setError,
  removeError,
  expandRightMenu,
  contractRightMenu,
  setHealthcheckTextWarning,
  openSideWindowTab,
  setSideWindowAsOpen,
  closeSideWindow,
  setDisplayedItems
} = globalSlice.actions

export default globalSlice.reducer
