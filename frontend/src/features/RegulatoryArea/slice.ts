import { createSlice } from '@reduxjs/toolkit'
import { BaseLayer } from 'domain/entities/layers/BaseLayer'

interface RegulatoryAreaBoState {
  selectedBaseLayer: BaseLayer
}

const INITIAL_STATE: RegulatoryAreaBoState = {
  selectedBaseLayer: BaseLayer.LIGHT
}

const regulatoryAreaBoSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'regulatoryAreaBo',
  reducers: {
    selectBaseLayer(state, action) {
      state.selectedBaseLayer = action.payload
    }
  }
})

export const regulatoryAreaBoActions = regulatoryAreaBoSlice.actions

export const regulatoryAreaBoReducer = regulatoryAreaBoSlice.reducer
