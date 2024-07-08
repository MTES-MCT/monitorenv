import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { isGeometryValid } from '@utils/geometryValidation'
import { InteractionType } from 'domain/entities/map/constants'

import type { HomeRootState } from '@store/index'
import type { GeoJSON } from 'domain/types/GeoJSON'

export enum VigilanceAreaFormTypeOpen {
  ADD_REGULATORY = 'ADD_REGULATORY',
  DRAW = 'DRAW',
  FORM = 'FORM'
}

type VigilanceAreaSliceState = {
  editingVigilanceAreaId: number | undefined
  formTypeOpen: VigilanceAreaFormTypeOpen | undefined
  geometry: GeoJSON.Geometry | undefined
  initialGeometry: GeoJSON.Geometry | undefined
  interactionType: InteractionType
  isCancelModalOpen: boolean
  isGeometryValid: boolean
  regulatoryAreaIdsToBeDisplayed: Array<number> | undefined
  regulatoryAreasToAdd: Array<number> | undefined
  selectedVigilanceAreaId: number | undefined
  vigilanceAreaIdToCancel: number | undefined
}
const INITIAL_STATE: VigilanceAreaSliceState = {
  editingVigilanceAreaId: undefined,
  formTypeOpen: VigilanceAreaFormTypeOpen.FORM,
  geometry: undefined,
  initialGeometry: undefined,
  interactionType: InteractionType.POLYGON,
  isCancelModalOpen: false,
  isGeometryValid: false,
  regulatoryAreaIdsToBeDisplayed: undefined,
  regulatoryAreasToAdd: undefined,
  selectedVigilanceAreaId: undefined,
  vigilanceAreaIdToCancel: undefined
}
export const vigilanceAreaSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'vigilanceArea',
  reducers: {
    addRegulatoryAreaIdsToBeDisplayed(state, action: PayloadAction<number>) {
      if (state.regulatoryAreaIdsToBeDisplayed) {
        state.regulatoryAreaIdsToBeDisplayed = [...state.regulatoryAreaIdsToBeDisplayed, action.payload]
      } else {
        state.regulatoryAreaIdsToBeDisplayed = [action.payload]
      }
    },
    addRegulatoryAreasToVigilanceArea(state, action: PayloadAction<Array<number>>) {
      if (action.payload.length === 0) {
        state.regulatoryAreasToAdd = action.payload
      }
      if (state.regulatoryAreasToAdd) {
        const newRegulatoryAreasToAdd = action.payload.filter(id => !state.regulatoryAreasToAdd?.includes(id))
        state.regulatoryAreasToAdd = [...state.regulatoryAreasToAdd, ...newRegulatoryAreasToAdd]
      } else {
        state.regulatoryAreasToAdd = action.payload
      }
    },
    closeCancelModal(state) {
      state.isCancelModalOpen = false
    },
    closeMainForm(state) {
      if (state.vigilanceAreaIdToCancel === state.editingVigilanceAreaId) {
        if (state.editingVigilanceAreaId === state.selectedVigilanceAreaId) {
          state.selectedVigilanceAreaId = undefined
        }
        state.editingVigilanceAreaId = undefined
        state.vigilanceAreaIdToCancel = undefined
        state.isCancelModalOpen = false

        return
      }

      state.editingVigilanceAreaId = state.vigilanceAreaIdToCancel
      state.vigilanceAreaIdToCancel = undefined
      state.isCancelModalOpen = false
    },
    createVigilanceArea(state) {
      state.selectedVigilanceAreaId = -1
      state.editingVigilanceAreaId = -1
      state.formTypeOpen = VigilanceAreaFormTypeOpen.FORM
      state.isGeometryValid = false
      state.geometry = undefined
    },
    deleteRegulatoryAreasFromVigilanceArea(state, action: PayloadAction<number>) {
      if (state.regulatoryAreasToAdd) {
        state.regulatoryAreasToAdd = state.regulatoryAreasToAdd.filter(id => id !== action.payload)
      }
    },
    openCancelModal(state, action: PayloadAction<number>) {
      state.isCancelModalOpen = true
      state.vigilanceAreaIdToCancel = action.payload
    },
    removeRegulatoryAreaIdsToBeDisplayed(state, action: PayloadAction<number>) {
      if (state.regulatoryAreaIdsToBeDisplayed) {
        state.regulatoryAreaIdsToBeDisplayed = state.regulatoryAreaIdsToBeDisplayed.filter(id => id !== action.payload)
      }
    },
    resetState() {
      return INITIAL_STATE
    },
    setEditingVigilanceAreaId(state, action: PayloadAction<number | undefined>) {
      state.editingVigilanceAreaId = action.payload
    },
    setFormTypeOpen(state, action: PayloadAction<VigilanceAreaFormTypeOpen | undefined>) {
      state.formTypeOpen = action.payload
    },
    setGeometry(state, action: PayloadAction<GeoJSON.Geometry | undefined>) {
      state.geometry = action.payload
      state.isGeometryValid = action.payload ? isGeometryValid(action.payload) : true
    },
    setInitialGeometry(state, action: PayloadAction<GeoJSON.Geometry | undefined>) {
      state.initialGeometry = action.payload
    },
    setInteractionType(state, action: PayloadAction<InteractionType>) {
      state.interactionType = action.payload
    },
    setSelectedVigilanceAreaId(state, action: PayloadAction<number | undefined>) {
      state.selectedVigilanceAreaId = action.payload
    }
  }
})

export const vigilanceAreaActions = vigilanceAreaSlice.actions
export const vigilanceAreaReducer = vigilanceAreaSlice.reducer

export const isLinkingRegulatoryToVigilanceArea = createSelector(
  (state: HomeRootState) => state.vigilanceArea.formTypeOpen,
  formTypeOpen => formTypeOpen === VigilanceAreaFormTypeOpen.ADD_REGULATORY
)
