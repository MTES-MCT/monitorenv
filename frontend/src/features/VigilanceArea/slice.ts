import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { isGeometryValid } from '@utils/geometryValidation'
import { InteractionType } from 'domain/entities/map/constants'

import type { GeoJSON } from 'domain/types/GeoJSON'

export enum VigilanceAreaFormTypeOpen {
  DRAW = 'DRAW',
  FORM = 'FORM',
  SELECT_AMP = 'SELECT_AMP',
  SELECT_REGULATORY = 'SELECT_REGULATORY'
}

type VigilanceAreaSliceState = {
  formTypeOpen: VigilanceAreaFormTypeOpen | undefined
  geometry: GeoJSON.Geometry | undefined
  interactionType: InteractionType
  isGeometryValid: boolean
}
const INITIAL_STATE: VigilanceAreaSliceState = {
  formTypeOpen: undefined,
  geometry: undefined,
  interactionType: InteractionType.POLYGON,

  isGeometryValid: false
}
export const vigilanceAreaSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'vigilanceArea',
  reducers: {
    setFormTypeOpen(state, action: PayloadAction<VigilanceAreaFormTypeOpen | undefined>) {
      state.formTypeOpen = action.payload
    },
    setGeometry(state, action: PayloadAction<GeoJSON.Geometry>) {
      state.geometry = action.payload
      state.isGeometryValid = isGeometryValid(action.payload)
    },
    setInteractionType(state, action: PayloadAction<InteractionType>) {
      state.interactionType = action.payload
    }
  }
})

export const vigilanceAreaActions = vigilanceAreaSlice.actions
export const vigilanceAreaReducer = vigilanceAreaSlice.reducer
