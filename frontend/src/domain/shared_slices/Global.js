import { createSlice } from '@reduxjs/toolkit'

/* eslint-disable */
/** @namespace GlobalReducer */
const GlobalReducer = null
/* eslint-enable */

const globalSlice = createSlice({
  name: 'global',
  initialState: {
    error: null,
    isUpdatingVessels: false,
    blockVesselsUpdate: false,
    rightMenuIsOpen: false,
    vesselListModalIsOpen: false,
    /** @type {string | null} healthcheckTextWarning */
    healthcheckTextWarning: null,
    previewFilteredVesselsMode: undefined,
    openedSideWindowTab: null,
    sideWindowIsOpen: false,
    lastSearchedVessels: []
  },
  reducers: {
    expandRightMenu (state) {
      state.rightMenuIsOpen = true
    },
    contractRightMenu (state) {
      state.rightMenuIsOpen = false
    },
    setIsUpdatingVessels (state) {
      state.isUpdatingVessels = true
    },
    openVesselListModal (state) {
      state.vesselListModalIsOpen = true
    },
    closeVesselListModal (state) {
      state.vesselListModalIsOpen = false
    },
    resetIsUpdatingVessels (state) {
      state.isUpdatingVessels = false
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
    /**
     * Block or not the vessel update cron - The vessel update is blocked when the
     * vessel list table is opened or when vessels filters are previewed
     * @param {Object=} state
     * @param {{payload: boolean}} action - blocked when true
     */
    setBlockVesselsUpdate (state, action) {
      state.blockVesselsUpdate = action.payload
    }
  }
})

export const {
  setError,
  removeError,
  setIsUpdatingVessels,
  resetIsUpdatingVessels,
  expandRightMenu,
  contractRightMenu,
  openVesselListModal,
  closeVesselListModal,
  setHealthcheckTextWarning,
  setPreviewFilteredVesselsMode,
  setBlockVesselsUpdate,
  openSideWindowTab,
  setSideWindowAsOpen,
  closeSideWindow,
  setUserType,
  addSearchedVessel
} = globalSlice.actions

export default globalSlice.reducer
