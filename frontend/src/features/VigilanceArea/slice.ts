import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { isGeometryValid } from '@utils/geometryValidation'
import { InteractionType } from 'domain/entities/map/constants'

import type { VigilanceArea } from './types'
import type { GeoJSON } from 'domain/types/GeoJSON'

export enum VigilanceAreaFormTypeOpen {
  DRAW = 'DRAW',
  EDIT_FORM = 'FORM',
  READ_FORM = 'READ_FORM',
  SELECT_AMP = 'SELECT_AMP',
  SELECT_REGULATORY = 'SELECT_REGULATORY'
}

type VigilanceAreaSliceState = {
  formTypeOpen: VigilanceAreaFormTypeOpen | undefined
  geometry: GeoJSON.Geometry | undefined
  interactionType: InteractionType
  isGeometryValid: boolean
  selectedVigilanceAreaId: number | undefined
  vigilanceAreaForm: Partial<VigilanceArea.VigilanceArea> | undefined
}
const INITIAL_STATE: VigilanceAreaSliceState = {
  formTypeOpen: undefined,
  geometry: undefined,
  interactionType: InteractionType.POLYGON,
  isGeometryValid: false,
  selectedVigilanceAreaId: undefined,
  vigilanceAreaForm: undefined
}
export const vigilanceAreaSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'vigilanceArea',
  reducers: {
    resetState() {
      return INITIAL_STATE
    },
    setFormTypeOpen(state, action: PayloadAction<VigilanceAreaFormTypeOpen | undefined>) {
      state.formTypeOpen = action.payload
    },
    setGeometry(state, action: PayloadAction<GeoJSON.Geometry>) {
      state.geometry = action.payload
      state.isGeometryValid = isGeometryValid(action.payload)
    },
    setInteractionType(state, action: PayloadAction<InteractionType>) {
      state.interactionType = action.payload
    },
    setSelectedVigilanceAreaId(state, action: PayloadAction<number | undefined>) {
      const vigilanceAreaId = action.payload

      if (vigilanceAreaId) {
        state.selectedVigilanceAreaId = action.payload
        state.formTypeOpen = VigilanceAreaFormTypeOpen.READ_FORM
      } else {
        state.selectedVigilanceAreaId = undefined
      }
    },
    setVigilanceAreaForm(state, action: PayloadAction<Partial<VigilanceArea.VigilanceArea> | undefined>) {
      state.vigilanceAreaForm = action.payload
    }
  }
})

export const vigilanceAreaActions = vigilanceAreaSlice.actions
export const vigilanceAreaReducer = vigilanceAreaSlice.reducer
