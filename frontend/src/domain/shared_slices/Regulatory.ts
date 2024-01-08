import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import type { RegulatoryLayerType } from '../../types'

const persistConfig = {
  key: 'regulatory',
  storage,
  whitelist: ['selectedRegulatoryLayerIds', 'showedRegulatoryLayerIds']
}

type RegulatorySliceState = {
  loadingRegulatoryZoneMetadata: boolean
  regulationSearchedZoneExtent: []
  regulatoryLayers: RegulatoryLayerType[]
  regulatoryLayersById: { [id: number]: RegulatoryLayerType }
  regulatoryLayersIdsByName: { [key: string]: number[] } | {}
  regulatoryZoneMetadata: any
  selectedRegulatoryLayerIds: number[]
  showedRegulatoryLayerIds: number[]
}
const initialState: RegulatorySliceState = {
  loadingRegulatoryZoneMetadata: false,
  regulationSearchedZoneExtent: [],
  regulatoryLayers: [],
  regulatoryLayersById: {},
  regulatoryLayersIdsByName: {},
  regulatoryZoneMetadata: null,
  selectedRegulatoryLayerIds: [],
  showedRegulatoryLayerIds: []
}

const regulatorySlice = createSlice({
  initialState,
  name: 'regulatory',
  reducers: {
    /**
     * Add regulatory zones to "My Zones" regulatory selection
     * @memberOf RegulatoryReducer
     * @param {Object} state
     * @param {layerId[]} action.payload - The regulatory zones
     */
    addRegulatoryZonesToMyLayers(state, action) {
      return {
        ...state,
        selectedRegulatoryLayerIds: _.union(state.selectedRegulatoryLayerIds, action.payload),
        showedRegulatoryLayerIds: _.union(state.showedRegulatoryLayerIds, action.payload)
      }
    },

    /**
     * hide RegulatoryLayer
     * @memberOf RegulatoryReducer
     * @param {Object} state
     * @param {number} action.payload - The regulatory zone id
     */
    hideRegulatoryLayer(state, action) {
      state.showedRegulatoryLayerIds = _.without(state.showedRegulatoryLayerIds, action.payload)
    },
    hideRegulatoryLayers(state, action) {
      state.showedRegulatoryLayerIds = _.without(state.showedRegulatoryLayerIds, ...action.payload)
    },

    /**
     * Remove regulatory zone(s) from "My Zones" regulatory selection, by providing a topic name to remove multiple zones
     * or simply the zone name to remove a specified zone
     * @memberOf RegulatoryReducer
     * @param {Object} state
     * @param {layerId[]} action - The regulatory zones to remove
     */
    removeRegulatoryZonesFromMyLayers(state, action) {
      return {
        ...state,
        selectedRegulatoryLayerIds: _.difference(state.selectedRegulatoryLayerIds, action.payload),
        showedRegulatoryLayerIds: _.difference(state.showedRegulatoryLayerIds, action.payload)
      }
    },

    /**
     * Set the regulation searched zone extent - used to fit the extent into the OpenLayers view
     * @function setRegulationSearchedZoneExtent
     * @memberOf RegulatoryReducer
     * @param {Object} state
     * @param {{payload: number[]}} action - the extent
     */
    setRegulationSearchedZoneExtent(state, action) {
      state.regulationSearchedZoneExtent = action.payload
    },

    /**
     * Set regulatory data structured as
     * LawType: {
     *   Topic: Zone[]
     * }
     * (see example)
     * @param {Object} state
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
    setRegulatoryLayers(state, { payload: { features } }: { payload: { features: RegulatoryLayerType[] } }) {
      const newState = features.reduce(
        (a, f) => ({
          regulatoryLayersById: { ...a.regulatoryLayersById, [f.id]: f },
          regulatoryLayersIdsByName: {
            ...a.regulatoryLayersIdsByName,
            [f.properties.layer_name]: a.regulatoryLayersIdsByName[f.properties.layer_name]
              ? [...a.regulatoryLayersIdsByName[f.properties.layer_name], f.id]
              : [f.id]
          }
        }),
        {
          regulatoryLayersById: {} as RegulatorySliceState['regulatoryLayersById'],
          regulatoryLayersIdsByName: {} as RegulatorySliceState['regulatoryLayersIdsByName']
        }
      )
      state.regulatoryLayers = features
      state.regulatoryLayersById = newState.regulatoryLayersById
      state.regulatoryLayersIdsByName = newState.regulatoryLayersIdsByName
    },
    /**
     * show RegulatoryLayer
     * @memberOf RegulatoryReducer
     * @param {Object} state
     * @param {RegulatoryZone[]} action.payload - The regulatory zone
     */
    showRegulatoryLayer(state, action) {
      state.showedRegulatoryLayerIds = _.uniq(_.concat(state.showedRegulatoryLayerIds, action.payload))
    }
  }
})

export const {
  addRegulatoryZonesToMyLayers,
  hideRegulatoryLayer,
  hideRegulatoryLayers,
  removeRegulatoryZonesFromMyLayers,
  setRegulationSearchedZoneExtent,
  setRegulatoryLayers,
  showRegulatoryLayer
} = regulatorySlice.actions

export const regulatorySlicePersistedReducer = persistReducer(persistConfig, regulatorySlice.reducer)

export const regulatoryActionSanitizer = action =>
  action.type === 'regulatory/setRegulatoryLayers' && action.payload
    ? { ...action, payload: '<<REGULATORY FEATURES>>' }
    : action
