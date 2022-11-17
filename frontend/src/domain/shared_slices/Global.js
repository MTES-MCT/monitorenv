/* eslint-disable sort-keys-fix/sort-keys-fix */
import { createSlice } from '@reduxjs/toolkit'

const globalSlice = createSlice({
  initialState: {
    // state entry for every component /menu displayed on map whose visibility should be controlled
    displayMissionMenuButton: true,
    displayDrawLayerModal: false,
    displayLayersSidebar: true,
    displayLocateOnMap: true,
    displayMeasurement: true,
    displayInterestPoint: true,

    displayMissionsOverlay: true,
    // state entry for every layer whose visibility should be controlled
    displayEditingMissionLayer: true,
    displayMissionsLayer: true,
    displaySelectedMissionLayer: true,

    // state entry for other children components whom visibility is already handled by parent components
    missionsMenuIsOpen: true,

    error: null,

    /** @type {string | null} healthcheckTextWarning */
    healthcheckTextWarning: null
  },
  name: 'global',
  reducers: {
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
    }
  }
})

export const { removeError, setDisplayedItems, setError, setHealthcheckTextWarning } = globalSlice.actions

export const globalReducer = globalSlice.reducer
