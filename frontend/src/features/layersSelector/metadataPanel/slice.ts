import { createSelector, createSlice } from '@reduxjs/toolkit'
import { includes } from 'lodash'

import { MonitorEnvLayers } from '../../../domain/entities/layers/constants'

import type { HomeRootState } from '@store/index'

type MetadataPanelSliceState = {
  metadataLayerId: number | undefined
  metadataLayerType: MonitorEnvLayers.REGULATORY_ENV | MonitorEnvLayers.AMP | undefined
  metadataPanelIsOpen: boolean
}

const metadataPanelSlice = createSlice({
  initialState: {
    metadataLayerId: undefined,
    metadataLayerType: undefined,
    metadataPanelIsOpen: false
  } as MetadataPanelSliceState,
  name: 'metadataPanel',
  reducers: {
    closeMetadataPanel(state) {
      state.metadataPanelIsOpen = false
      state.metadataLayerId = undefined
      state.metadataLayerType = undefined
    },
    openAMPMetadataPanel(state, action) {
      state.metadataPanelIsOpen = true
      state.metadataLayerType = MonitorEnvLayers.AMP
      state.metadataLayerId = action.payload
    },
    openRegulatoryMetadataPanel(state, action) {
      state.metadataPanelIsOpen = true
      state.metadataLayerType = MonitorEnvLayers.REGULATORY_ENV
      state.metadataLayerId = action.payload
    }
  }
})

export const { closeMetadataPanel, openAMPMetadataPanel, openRegulatoryMetadataPanel } = metadataPanelSlice.actions

export const metadataPanelSliceReducer = metadataPanelSlice.reducer

const isMetadataPanelOpen = (state: HomeRootState) => state.metadataPanel.metadataPanelIsOpen
const getMetadataLayerType = (state: HomeRootState) => state.metadataPanel.metadataLayerType
const getMetadataLayerId = (state: HomeRootState) => state.metadataPanel.metadataLayerId

export const getMetadataIsOpenForRegulatoryLayerId = createSelector(
  [isMetadataPanelOpen, getMetadataLayerType, getMetadataLayerId, (_, layerId: number) => layerId],
  (isOpen, metadataLayerType, metadataLayerId, layerId) =>
    isOpen && metadataLayerType === MonitorEnvLayers.REGULATORY_ENV && metadataLayerId === layerId
)

export const getMetadataIsOpenForRegulatoryLayerIds = createSelector(
  [isMetadataPanelOpen, getMetadataLayerType, getMetadataLayerId, (_, layerIds: number[]) => layerIds],
  (isOpen, metadataLayerType, metadataLayerId, layerIds) =>
    isOpen &&
    metadataLayerType === MonitorEnvLayers.REGULATORY_ENV &&
    !!metadataLayerId &&
    includes(layerIds, metadataLayerId)
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
