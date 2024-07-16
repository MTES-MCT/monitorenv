import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { isGeometryValid } from '@utils/geometryValidation'
import { InteractionType } from 'domain/entities/map/constants'

import { NEW_VIGILANCE_AREA_ID } from './constants'

import type { HomeRootState } from '@store/index'
import type { GeoJSON } from 'domain/types/GeoJSON'

export enum VigilanceAreaFormTypeOpen {
  ADD_AMP = 'ADD_AMP',
  ADD_REGULATORY = 'ADD_REGULATORY',
  DRAW = 'DRAW',
  FORM = 'FORM'
}

type VigilanceAreaSliceState = {
  ampIdsToBeDisplayed: Array<number> | undefined
  ampToAdd: Array<number>
  editingVigilanceAreaId: number | undefined
  formTypeOpen: VigilanceAreaFormTypeOpen | undefined
  geometry: GeoJSON.Geometry | undefined
  initialGeometry: GeoJSON.Geometry | undefined
  interactionType: InteractionType
  isCancelModalOpen: boolean
  isGeometryValid: boolean
  regulatoryAreaIdsToBeDisplayed: Array<number> | undefined
  regulatoryAreasToAdd: Array<number>
  selectedVigilanceAreaId: number | undefined
  vigilanceAreaIdToCancel: number | undefined
}
const INITIAL_STATE: VigilanceAreaSliceState = {
  ampIdsToBeDisplayed: undefined,
  ampToAdd: [],
  editingVigilanceAreaId: undefined,
  formTypeOpen: VigilanceAreaFormTypeOpen.FORM,
  geometry: undefined,
  initialGeometry: undefined,
  interactionType: InteractionType.POLYGON,
  isCancelModalOpen: false,
  isGeometryValid: false,
  regulatoryAreaIdsToBeDisplayed: undefined,
  regulatoryAreasToAdd: [],
  selectedVigilanceAreaId: undefined,
  vigilanceAreaIdToCancel: undefined
}
export const vigilanceAreaSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'vigilanceArea',
  reducers: {
    addAMPIdsToBeDisplayed(state, action: PayloadAction<number>) {
      if (state.ampIdsToBeDisplayed) {
        state.ampIdsToBeDisplayed = [...state.ampIdsToBeDisplayed, action.payload]
      } else {
        state.ampIdsToBeDisplayed = [action.payload]
      }
    },
    addAMPsToVigilanceArea(state, action: PayloadAction<Array<number>>) {
      if (action.payload.length === 0) {
        state.ampToAdd = []

        return
      }

      if (state.ampToAdd.length === 0) {
        state.ampToAdd = action.payload

        return
      }

      const newAMPToAdd = action.payload.filter(id => !state.ampToAdd?.includes(id))
      state.ampToAdd = [...state.ampToAdd, ...newAMPToAdd]
    },
    addRegulatoryAreaIdsToBeDisplayed(state, action: PayloadAction<number>) {
      if (state.regulatoryAreaIdsToBeDisplayed) {
        state.regulatoryAreaIdsToBeDisplayed = [...state.regulatoryAreaIdsToBeDisplayed, action.payload]
      } else {
        state.regulatoryAreaIdsToBeDisplayed = [action.payload]
      }
    },
    addRegulatoryAreasToVigilanceArea(state, action: PayloadAction<Array<number>>) {
      if (action.payload.length === 0) {
        state.regulatoryAreasToAdd = []

        return
      }

      if (state.regulatoryAreasToAdd.length === 0) {
        state.regulatoryAreasToAdd = action.payload

        return
      }

      const newRegulatoryAreasToAdd = action.payload.filter(id => !state.regulatoryAreasToAdd?.includes(id))
      state.regulatoryAreasToAdd = [...state.regulatoryAreasToAdd, ...newRegulatoryAreasToAdd]
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
      state.selectedVigilanceAreaId = state.vigilanceAreaIdToCancel
      state.vigilanceAreaIdToCancel = undefined
      state.isCancelModalOpen = false
    },
    createVigilanceArea(state) {
      if (!state.editingVigilanceAreaId) {
        return {
          ...INITIAL_STATE,
          editingVigilanceAreaId: NEW_VIGILANCE_AREA_ID,
          selectedVigilanceAreaId: NEW_VIGILANCE_AREA_ID
        }
      }

      return {
        ...state,
        isCancelModalOpen: true,
        vigilanceAreaIdToCancel: NEW_VIGILANCE_AREA_ID
      }
    },
    deleteAMPsFromVigilanceArea(state, action: PayloadAction<number>) {
      state.ampToAdd = state.ampToAdd.filter(id => id !== action.payload)
    },
    deleteRegulatoryAreasFromVigilanceArea(state, action: PayloadAction<number>) {
      state.regulatoryAreasToAdd = state.regulatoryAreasToAdd.filter(id => id !== action.payload)
    },
    openCancelModal(state, action: PayloadAction<number>) {
      state.isCancelModalOpen = true
      state.vigilanceAreaIdToCancel = action.payload
    },
    removeAMPIdsToBeDisplayed(state, action: PayloadAction<number>) {
      if (state.ampIdsToBeDisplayed) {
        state.ampIdsToBeDisplayed = state.ampIdsToBeDisplayed.filter(id => id !== action.payload)
      }
    },
    removeRegulatoryAreaIdsToBeDisplayed(state, action: PayloadAction<number>) {
      if (state.regulatoryAreaIdsToBeDisplayed) {
        state.regulatoryAreaIdsToBeDisplayed = state.regulatoryAreaIdsToBeDisplayed.filter(id => id !== action.payload)
      }
    },
    resetEditingVigilanceAreaState(state) {
      // if we are creating a new vigilance area, we want to reset the state to the initial state
      if (state.editingVigilanceAreaId === NEW_VIGILANCE_AREA_ID) {
        return INITIAL_STATE
      }

      return {
        ...INITIAL_STATE,
        ampIdsToBeDisplayed: state.ampIdsToBeDisplayed,
        regulatoryAreaIdsToBeDisplayed: state.regulatoryAreaIdsToBeDisplayed,
        selectedVigilanceAreaId: state.selectedVigilanceAreaId
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

export const getIsLinkingRegulatoryToVigilanceArea = createSelector(
  (state: HomeRootState) => state.vigilanceArea.formTypeOpen,
  formTypeOpen => formTypeOpen === VigilanceAreaFormTypeOpen.ADD_REGULATORY
)

export const getIsLinkingAMPToVigilanceArea = createSelector(
  (state: HomeRootState) => state.vigilanceArea.formTypeOpen,
  formTypeOpen => formTypeOpen === VigilanceAreaFormTypeOpen.ADD_AMP
)

export const getIsLinkingZonesToVigilanceArea = createSelector(
  (state: HomeRootState) => state.vigilanceArea.formTypeOpen,
  formTypeOpen =>
    formTypeOpen === VigilanceAreaFormTypeOpen.ADD_REGULATORY || formTypeOpen === VigilanceAreaFormTypeOpen.ADD_AMP
)
