import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'

const NOT_FOUND = -1

const regulatoryLayerSearchSlice = createSlice({
  initialState: {
    filterSearchOnMapExtent: false,

    /** @type RegulatoryLawTypes regulatoryLayersSearchResult */
    regulatoryLayersSearchResult: null,
    /** @type RegulatoryZone[] regulatoryZonesChecked */
    regulatoryZonesChecked: [],
    zoneSelected: null
  },
  name: 'regulatoryLayerSearch',
  reducers: {
    /**
     * Add zones to regulatory zones selection in progress to add to "My Zones"
     * @param {Object=} state
     * @param {RegulatoryZone[]} action - The regulatory zones
     */
    checkRegulatoryZones(state, action) {
      return { ...state, regulatoryZonesChecked: _.union(state.regulatoryZonesChecked, action.payload) }
    },

    /**
     * Reset regulatory zones selection
     * @param {Object=} state
     */
    resetRegulatoryZonesChecked(state) {
      state.regulatoryZonesChecked = []
    },

    /**
     * Set the selected zone to filter regulations
     * @param {Object=} state
     */
    resetZoneSelected(state) {
      state.zoneSelected = null
    },

    /**
     * Set FilterSearchOnMapExtent to true/false
     * @param {Object} state
     * @param {{
     * payload: boolean
     * }} action
     */
    setFilterSearchOnMapExtent(state, action) {
      state.filterSearchOnMapExtent = action.payload
    },

    /**
     * Set regulatory layers search result structured as
     * LawType: {
     *   Topic: Zone[]
     * }
     * @param {Object} state
     * @param {RegulatoryLawTypes | null} action - The regulatory search result
     */
    setRegulatoryLayersSearchResult(state, action) {
      state.regulatoryLayersSearchResult = action.payload
    },

    /**
     * Set the selected zone to filter regulations
     * @param {Object} state
     * @param {{
     * payload: {
     *  name: string,
     *  code: string,
     *  feature: GeoJSON
     * }}} action - The zone
     */
    setZoneSelected(state, action) {
      state.zoneSelected = action.payload
    },

    /**
     * Add zone to regulatory zones selection in progress to add to "My Zones"
     * @param {Object} state
     * @param {RegulatoryZone[]} action - The regulatory zones
     */
    toggleRegulatoryZone(state, action) {
      const regulatoryZoneIndex = state.regulatoryZonesChecked.indexOf(action.payload)
      if (regulatoryZoneIndex === NOT_FOUND) {
        state.regulatoryZonesChecked.push(action.payload)
      } else {
        state.regulatoryZonesChecked.splice(regulatoryZoneIndex, 1)
      }
    },

    /**
     * Remove zones from regulatory zones selection in progress to add to "My Zones"
     * @param {Object} state
     * @param {{
     *   topic: string,
     *   zone: string
     * }[]} action - The regulatory zones and topic
     */
    uncheckRegulatoryZones(state, action) {
      return { ...state, regulatoryZonesChecked: _.difference(state.regulatoryZonesChecked, action.payload) }
    }
  }
})

export const {
  checkRegulatoryZones,
  resetRegulatoryZonesChecked,
  resetZoneSelected,
  setFilterSearchOnMapExtent,
  setRegulatoryLayersSearchResult,
  setZoneSelected,
  toggleRegulatoryZone,
  uncheckRegulatoryZones
} = regulatoryLayerSearchSlice.actions

export default regulatoryLayerSearchSlice.reducer
