import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { isGeometryValid } from '@utils/geometryValidation'
import { InteractionType } from 'domain/entities/map/constants'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { NEW_VIGILANCE_AREA_ID } from './constants'

import type { HomeRootState } from '@store/index'
import type { GeoJSON } from 'domain/types/GeoJSON'

const persistConfig = {
  key: 'vigilanceArea',
  storage,
  whitelist: ['myVigilanceAreaIds', 'myVigilanceAreaIdsDisplayed']
}

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
  myVigilanceAreaIds: Array<number>
  myVigilanceAreaIdsDisplayed: Array<number>
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
  myVigilanceAreaIds: [],
  myVigilanceAreaIdsDisplayed: [],
  regulatoryAreaIdsToBeDisplayed: undefined,
  regulatoryAreasToAdd: [],
  selectedVigilanceAreaId: undefined,
  vigilanceAreaIdToCancel: undefined
}
export const vigilanceAreaSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'vigilanceArea',
  reducers: {
    addAmpIdsToBeDisplayed(state, action: PayloadAction<number>) {
      if (state.ampIdsToBeDisplayed) {
        state.ampIdsToBeDisplayed = [...state.ampIdsToBeDisplayed, action.payload]
      } else {
        state.ampIdsToBeDisplayed = [action.payload]
      }
    },
    addAmpIdsToVigilanceArea(state, action: PayloadAction<Array<number>>) {
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
    addIdsToMyVigilanceAreaIds(state, action: PayloadAction<Array<number>>) {
      state.myVigilanceAreaIds = [...state.myVigilanceAreaIds, ...action.payload]
      state.myVigilanceAreaIdsDisplayed = [...state.myVigilanceAreaIdsDisplayed, ...action.payload]
    },
    addIdsToMyVigilanceAreaIdsToBeDisplayed(state, action: PayloadAction<Array<number>>) {
      state.myVigilanceAreaIdsDisplayed = [...state.myVigilanceAreaIdsDisplayed, ...action.payload]
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
    deleteAmpFromVigilanceArea(state, action: PayloadAction<number>) {
      state.ampToAdd = state.ampToAdd.filter(id => id !== action.payload)
    },
    deleteAmpIdsToBeDisplayed(state, action: PayloadAction<number>) {
      if (state.ampIdsToBeDisplayed) {
        state.ampIdsToBeDisplayed = state.ampIdsToBeDisplayed.filter(id => id !== action.payload)
      }
    },
    deleteIdToMyVigilanceAreaIds(state, action: PayloadAction<number>) {
      state.myVigilanceAreaIds = state.myVigilanceAreaIds.filter(id => id !== action.payload)
      state.myVigilanceAreaIdsDisplayed = state.myVigilanceAreaIdsDisplayed.filter(id => id !== action.payload)
    },
    deleteIdToMyVigilanceAreaIdsToBeDisplayed(state, action: PayloadAction<number>) {
      state.myVigilanceAreaIdsDisplayed = state.myVigilanceAreaIdsDisplayed.filter(id => id !== action.payload)
    },
    deleteRegulatoryAreaIdsToBeDisplayed(state, action: PayloadAction<number>) {
      if (state.regulatoryAreaIdsToBeDisplayed) {
        state.regulatoryAreaIdsToBeDisplayed = state.regulatoryAreaIdsToBeDisplayed.filter(id => id !== action.payload)
      }
    },
    deleteRegulatoryAreasFromVigilanceArea(state, action: PayloadAction<number>) {
      state.regulatoryAreasToAdd = state.regulatoryAreasToAdd.filter(id => id !== action.payload)
    },
    openCancelModal(state, action: PayloadAction<number>) {
      state.isCancelModalOpen = true
      state.vigilanceAreaIdToCancel = action.payload
    },
    resetEditingVigilanceAreaState(state) {
      if (state.editingVigilanceAreaId === NEW_VIGILANCE_AREA_ID) {
        return {
          ...INITIAL_STATE,
          myVigilanceAreaIds: state.myVigilanceAreaIds,
          myVigilanceAreaIdsDisplayed: state.myVigilanceAreaIdsDisplayed
        }
      }

      return {
        ...INITIAL_STATE,
        ampIdsToBeDisplayed: state.ampIdsToBeDisplayed,
        myVigilanceAreaIds: state.myVigilanceAreaIds,
        myVigilanceAreaIdsDisplayed: state.myVigilanceAreaIdsDisplayed,
        regulatoryAreaIdsToBeDisplayed: state.regulatoryAreaIdsToBeDisplayed,
        selectedVigilanceAreaId: state.selectedVigilanceAreaId
      }
    },
    resetState(state) {
      return {
        ...INITIAL_STATE,
        myVigilanceAreaIds: state.myVigilanceAreaIds,
        myVigilanceAreaIdsDisplayed: state.myVigilanceAreaIdsDisplayed
      }
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
    },
    updateEditingVigilanceArea(
      state,
      action: PayloadAction<{
        ampToAdd: Array<number>
        geometry: GeoJSON.Geometry | undefined
        regulatoryAreasToAdd: Array<number>
      }>
    ) {
      state.ampToAdd = action.payload.ampToAdd
      state.geometry = action.payload.geometry
      state.regulatoryAreasToAdd = action.payload.regulatoryAreasToAdd
    }
  }
})

export const vigilanceAreaActions = vigilanceAreaSlice.actions
export const vigilanceAreaPersistedReducer = persistReducer(persistConfig, vigilanceAreaSlice.reducer)

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
