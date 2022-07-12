import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'

const NOT_FOUND = -1

const regulatoryLayerSearchSlice = createSlice({
  name: 'regulatoryLayerSearch',
  initialState: {
    /** @type RegulatoryZone[] regulatoryZonesChecked */
    regulatoryZonesChecked: [],
    /** @type RegulatoryLawTypes regulatoryLayersSearchResult */
    regulatoryLayersSearchResult: null,
    advancedSearchIsOpen: false,
    zoneSelected: null,
    filterSearchOnMapExtent: false,
  },
  reducers: {
     /**
     * Add zone to regulatory zones selection in progress to add to "My Zones"
     * @param {Object=} state
     * @param {RegulatoryZone[]} action - The regulatory zones
     */
    toggleRegulatoryZone (state, action) {
      const regulatoryZoneIndex = state.regulatoryZonesChecked.indexOf(action.payload)
      if (regulatoryZoneIndex === NOT_FOUND) {
        state.regulatoryZonesChecked.push(action.payload)
      } else {
        state.regulatoryZonesChecked.splice(regulatoryZoneIndex, 1)
      }
    },
    /**
     * Add zones to regulatory zones selection in progress to add to "My Zones"
     * @param {Object=} state
     * @param {RegulatoryZone[]} action - The regulatory zones
     */
    checkRegulatoryZones (state, action) {
      return {...state, regulatoryZonesChecked : _.union(state.regulatoryZonesChecked, action.payload)}
    },
    /**
     * Remove zones from regulatory zones selection in progress to add to "My Zones"
     * @param {Object=} state
     * @param {{
     *   topic: string,
     *   zone: string
     * }[]} action - The regulatory zones and topic
     */
    uncheckRegulatoryZones (state, action) {
      return {...state, regulatoryZonesChecked: _.difference(state.regulatoryZonesChecked, action.payload)}
    },
    /**
     * Reset regulatory zones selection
     * @param {Object=} state
     */
    resetRegulatoryZonesChecked (state) {
      state.regulatoryZonesChecked = []
    },
    /**
     * Set regulatory layers search result structured as
     * LawType: {
     *   Topic: Zone[]
     * }
     * @param {Object=} state
     * @param {RegulatoryLawTypes | null} action - The regulatory search result
     */
    setRegulatoryLayersSearchResult (state, action) {
      state.regulatoryLayersSearchResult = action.payload
    },
    /**
     * Set regulatory advanced search as open or closed
     * @param {Object=} state
     * @param {boolean} action - the open or close boolean
     */
    setAdvancedSearchIsOpen (state, action) {
      state.advancedSearchIsOpen = action.payload
    },
    /**
     * Set the selected zone to filter regulations
     * @param {Object=} state
     * @param {{
     * payload: {
     *  name: string,
     *  code: string,
     *  feature: GeoJSON
     * }}} action - The zone
     */
    setZoneSelected (state, action) {
      state.zoneSelected = action.payload
    },
    /**
     * Set the selected zone to filter regulations
     * @param {Object=} state
     */
    resetZoneSelected (state) {
      state.zoneSelected = null
    },
    /**
     * Set FilterSearchOnMapExtent to true/false
     * @param {Object=} state
     * @param {{
     * payload: boolean
     * }} action 
     */
     setFilterSearchOnMapExtent (state, action) {
       state.filterSearchOnMapExtent = action.payload
     }
  }
})

export const {
  toggleRegulatoryZone,
  checkRegulatoryZones,
  uncheckRegulatoryZones,
  resetRegulatoryZonesChecked,
  setRegulatoryLayersSearchResult,
  setAdvancedSearchIsOpen,
  setZoneSelected,
  resetZoneSelected,
  setFilterSearchOnMapExtent
} = regulatoryLayerSearchSlice.actions

export default regulatoryLayerSearchSlice.reducer
