import { RegulatoryArea } from '@features/RegulatoryArea/types'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { BaseLayer } from 'domain/entities/layers/BaseLayer'

interface RegulatoryAreaBoState {
  editingRegulatoryAreaGroup?: RegulatoryArea.RegulatoryAreaGroupToApi | undefined
  newRegulatoryAreaId?: number
  selectedBaseLayer: BaseLayer
}

const INITIAL_STATE: RegulatoryAreaBoState = {
  editingRegulatoryAreaGroup: undefined,
  newRegulatoryAreaId: undefined,
  selectedBaseLayer: BaseLayer.LIGHT
}

const regulatoryAreaBoSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'regulatoryAreaBo',
  reducers: {
    selectBaseLayer(state, action) {
      state.selectedBaseLayer = action.payload
    },
    setEditingRegulatoryAreaGroup(state, action: PayloadAction<RegulatoryArea.RegulatoryAreaGroupToApi | undefined>) {
      state.editingRegulatoryAreaGroup = action.payload
    },
    setNewRegulatoryAreaId(state, action) {
      state.newRegulatoryAreaId = action.payload
    }
  }
})

export const regulatoryAreaBoActions = regulatoryAreaBoSlice.actions

export const regulatoryAreaBoReducer = regulatoryAreaBoSlice.reducer
