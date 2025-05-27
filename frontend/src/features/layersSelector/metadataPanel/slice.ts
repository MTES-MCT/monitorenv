import { createSelector, createSlice } from '@reduxjs/toolkit'

import {
  MonitorEnvLayers,
  type RegulatoryOrAMPOrViglanceAreaLayerType
} from '../../../domain/entities/layers/constants'

import type { HomeRootState } from '@store/index'
import type { AMPProperties } from 'domain/entities/AMPs'
import type { RegulatoryLayerCompactProperties } from 'domain/entities/regulatory'
import type { OverlayItem } from 'domain/types/map'
import type { Coordinate } from 'ol/coordinate'

type MetadataPanelSliceState = {
  layerOverlayCoordinates: Coordinate | undefined
  layerOverlayIsOpen: boolean
  layerOverlayItems: OverlayItem<
    RegulatoryOrAMPOrViglanceAreaLayerType,
    AMPProperties | RegulatoryLayerCompactProperties
  >[]
  metadataLayerId: number | string | undefined
  metadataLayerType:
    | MonitorEnvLayers.REGULATORY_ENV
    | MonitorEnvLayers.AMP
    | MonitorEnvLayers.VIGILANCE_AREA
    | MonitorEnvLayers.LOCALIZED_AREAS
    | undefined
  metadataPanelIsOpen: boolean
}

const layersMetadataSlice = createSlice({
  initialState: {
    layerOverlayCoordinates: undefined,
    layerOverlayIsOpen: false,
    layerOverlayItems: [],
    metadataLayerId: undefined,
    metadataLayerType: undefined,
    metadataPanelIsOpen: false
  } as MetadataPanelSliceState,
  name: 'layersMetadata',
  reducers: {
    closeLayerOverlay(state) {
      state.layerOverlayIsOpen = false
      state.layerOverlayCoordinates = undefined
      state.layerOverlayItems = []
    },
    closeMetadataPanel(state) {
      state.metadataPanelIsOpen = false
      state.metadataLayerId = undefined
      state.metadataLayerType = undefined
    },
    openAMPMetadataPanel(state, action: { payload: number }) {
      state.metadataPanelIsOpen = true
      state.metadataLayerType = MonitorEnvLayers.AMP
      state.metadataLayerId = action.payload
    },
    openLayerOverlay(state, action: { payload: Coordinate }) {
      state.layerOverlayIsOpen = true
      state.layerOverlayCoordinates = action.payload
    },
    openLocalizedAreasMetadataPanel(state, action: { payload: string }) {
      state.metadataPanelIsOpen = true
      state.metadataLayerType = MonitorEnvLayers.LOCALIZED_AREAS
      state.metadataLayerId = action.payload
    },
    openRegulatoryMetadataPanel(state, action) {
      state.metadataPanelIsOpen = true
      state.metadataLayerType = MonitorEnvLayers.REGULATORY_ENV
      state.metadataLayerId = action.payload
    },
    setLayerOverlayItems(state, action) {
      state.layerOverlayItems = action.payload
    }
  }
})

export const {
  closeLayerOverlay,
  closeMetadataPanel,
  openAMPMetadataPanel,
  openLayerOverlay,
  openLocalizedAreasMetadataPanel,
  openRegulatoryMetadataPanel,
  setLayerOverlayItems
} = layersMetadataSlice.actions

export const layersMetadataSliceReducer = layersMetadataSlice.reducer

const isMetadataPanelOpen = (state: HomeRootState) => state.layersMetadata.metadataPanelIsOpen
const getMetadataLayerType = (state: HomeRootState) => state.layersMetadata.metadataLayerType
const getMetadataLayerId = (state: HomeRootState) => state.layersMetadata.metadataLayerId

export const getMetadataIsOpenForRegulatoryLayerId = createSelector(
  [isMetadataPanelOpen, getMetadataLayerType, getMetadataLayerId, (_, layerId: number) => layerId],
  (isOpen, metadataLayerType, metadataLayerId, layerId) =>
    isOpen && metadataLayerType === MonitorEnvLayers.REGULATORY_ENV && metadataLayerId === layerId
)

export const getMetadataIsOpenForAMPLayerId = createSelector(
  [isMetadataPanelOpen, getMetadataLayerType, getMetadataLayerId, (_, layerId: number) => layerId],
  (isOpen, metadataLayerType, metadataLayerId, layerId) =>
    isOpen && metadataLayerType === MonitorEnvLayers.AMP && metadataLayerId === layerId
)

export const getDisplayedMetadataAMPLayerId = createSelector(
  [isMetadataPanelOpen, getMetadataLayerType, getMetadataLayerId],
  (isOpen, layerType, layerId) => (isOpen && layerType === MonitorEnvLayers.AMP ? layerId : undefined)
)

export const getDisplayedMetadataRegulatoryLayerId = createSelector(
  [isMetadataPanelOpen, getMetadataLayerType, getMetadataLayerId],
  (isOpen, layerType, layerId) => (isOpen && layerType === MonitorEnvLayers.REGULATORY_ENV ? layerId : undefined)
)

export const getDisplayedMetadataLayerIdAndType = createSelector(
  [getMetadataLayerType, getMetadataLayerId],
  (layerType, layerId) => ({ layerId, layerType })
)
