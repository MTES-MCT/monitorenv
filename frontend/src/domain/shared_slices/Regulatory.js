import { createSlice } from '@reduxjs/toolkit'
import _ from "lodash";

/* eslint-disable */
/** @namespace RegulatoryReducer */
const RegulatoryReducer = null
/* eslint-enable */


const regulatorySlice = createSlice({
  name: 'regulatory',
  initialState: {
    isReadyToShowRegulatoryLayers: false,
    /** @type {Object.<string, RegulatoryZone[]>} selectedRegulatoryLayers */
    /** @type RegulatoryLawTypes regulatoryLayers */
    regulatoryLayers: [],
    selectedRegulatoryLayerIds: [],
    showedRegulatoryLayerIds:[],
    regulatoryZoneMetadata: null,
    loadingRegulatoryZoneMetadata: false,
    regulatoryZoneMetadataPanelIsOpen: false,
    /** @type ol.geom.Geometry[] */
    regulatoryGeometriesToPreview: null,
    regulationSearchedZoneExtent: []
  },
  reducers: {
    setRegulatoryGeometriesToPreview (state, action) {
      state.regulatoryGeometriesToPreview = action.payload
    },
    resetRegulatoryGeometriesToPreview (state) {
      state.regulatoryGeometriesToPreview = null
    },
    /**
     * Add regulatory zones to "My Zones" regulatory selection
     * @memberOf RegulatoryReducer
     * @param {Object=} state
     * @param {RegulatoryZone[]} action.payload - The regulatory zones
     */
    addRegulatoryZonesToMyLayers (state, action) {
      return {...state, selectedRegulatoryLayerIds : _.union(state.selectedRegulatoryLayerIds, action.payload)}
    },
    /**
     * Remove regulatory zone(s) from "My Zones" regulatory selection, by providing a topic name to remove multiple zones
     * or simply the zone name to remove a specified zone
     * @memberOf RegulatoryReducer
     * @param {Object=} state
     * @param {layerId[]} action - The regulatory zones to remove
     */
    removeRegulatoryZonesFromMyLayers (state, action) {
      return {...state, 
        selectedRegulatoryLayerIds: _.difference(state.selectedRegulatoryLayerIds, action.payload),
        showedRegulatoryLayerIds: _.difference(state.showedRegulatoryLayerIds, action.payload)
      }
    },/**
     * show RegulatoryLayer
     * @memberOf RegulatoryReducer
     * @param {Object=} state
     * @param {RegulatoryZone} action.payload - The regulatory zone
     */
    showRegulatoryLayer (state, action) {
      state.showedRegulatoryLayerIds = _.uniq(_.concat(state.showedRegulatoryLayerIds, action.payload))
      // return {...state, showedRegulatoryLayerIds : _.union(state.showedRegulatoryLayerIds, action.payload)}
    },
    /**
     * hide RegulatoryLayer
     * @memberOf RegulatoryReducer
     * @param {Object=} state
     * @param {RegulatoryZone} action.payload - The regulatory zone
     */
    hideRegulatoryLayer (state, action) {
      state.showedRegulatoryLayerIds = _.without(state.showedRegulatoryLayerIds, action.payload)
    },
    setIsReadyToShowRegulatoryZones (state) {
      state.isReadyToShowRegulatoryLayers = true
    },
    setLoadingRegulatoryZoneMetadata (state) {
      state.loadingRegulatoryZoneMetadata = true
      state.regulatoryZoneMetadata = null
      state.regulatoryZoneMetadataPanelIsOpen = true
    },
    resetLoadingRegulatoryZoneMetadata (state) {
      state.loadingRegulatoryZoneMetadata = false
    },
    setRegulatoryZoneMetadata (state, action) {
      state.loadingRegulatoryZoneMetadata = false
      state.regulatoryZoneMetadata = action.payload
    },
    closeRegulatoryZoneMetadataPanel (state) {
      state.regulatoryZoneMetadataPanelIsOpen = false
      state.regulatoryZoneMetadata = null
    },
    /**
     * Set regulatory data structured as
     * LawType: {
     *   Topic: Zone[]
     * }
     * (see example)
     * @param {Object=} state
     * @param {{payload: RegulatoryLawTypes}} action - The regulatory data
     * @memberOf RegulatoryReducer
     * @example
     * {
     *  "Reg locale / NAMO": {
     *   "Armor_CSJ_Dragues": [
     *     {
     *       bycatch: undefined,
     *       closingDate: undefined,
     *       deposit: undefined,
     *       lawType: "Reg locale",
     *       mandatoryDocuments: undefined,
     *       obligations: undefined,
     *       openingDate: undefined,
     *       period: undefined,
     *       permissions: undefined,
     *       prohibitions: undefined,
     *       quantity: undefined,
     *       region: "Bretagne",
     *       regulatoryReferences: "[
     *         {\"url\": \"http://legipeche.metier.i2/arrete-prefectoral-r53-2020-04-24-002-delib-2020-a9873.html?id_rub=1637\",
     *         \"reference\": \"ArrÃªtÃ© PrÃ©fectoral R53-2020-04-24-002 - dÃ©lib 2020-004 / NAMO\"}, {\"url\": \"\", \"reference\": \"126-2020\"}]",
     *       rejections: undefined,
     *       size: undefined,
     *       state: undefined,
     *       technicalMeasurements: undefined,
     *       topic: "Armor_CSJ_Dragues",
     *       zone: "Secteur 3"
     *     }
     *   ]
     *   "GlÃ©nan_CSJ_Dragues": (1) […],
     *   "Bretagne_Laminaria_Hyperborea_Scoubidous - 2019": (1) […],
     *  },
     *  "Reg locale / Sud-Atlantique, SA": {
     *   "Embouchure_Gironde": (1) […],
     *   "Pertuis_CSJ_Dragues": (6) […],
     *   "SA_Chaluts_Pelagiques": (5) […]
     *  }
     * }
     */
    setRegulatoryLayers (state, { payload: { features } }) {
      state.regulatoryLayers = features
    },
    /**
     * Set the regulation searched zone extent - used to fit the extent into the OpenLayers view
     * @function setRegulationSearchedZoneExtent
     * @memberOf RegulatoryReducer
     * @param {Object=} state
     * @param {{payload: number[]}} action - the extent
     */
    setRegulationSearchedZoneExtent (state, action) {
      state.regulationSearchedZoneExtent = action.payload
    }
  }
})

export const {
  addRegulatoryZonesToMyLayers,
  removeRegulatoryZonesFromMyLayers,
  showRegulatoryLayer,
  hideRegulatoryLayer,
  setIsReadyToShowRegulatoryZones,
  setLoadingRegulatoryZoneMetadata,
  resetLoadingRegulatoryZoneMetadata,
  setRegulatoryZoneMetadata,
  closeRegulatoryZoneMetadataPanel,
  setRegulatoryLayers,
  setRegulatoryGeometriesToPreview,
  resetRegulatoryGeometriesToPreview,
  setRegulationSearchedZoneExtent
} = regulatorySlice.actions

export default regulatorySlice.reducer


export const regulatoryActionSanitizer = (action) => (
  action.type === 'regulatory/setRegulatoryLayers' && action.payload ?
{...action, payload: '<<REGULATORY FEATURES>>'} : action
)
