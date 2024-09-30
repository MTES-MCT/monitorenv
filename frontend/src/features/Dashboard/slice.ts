import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { isGeometryValid } from '@utils/geometryValidation'
import { InteractionType } from 'domain/entities/map/constants'

import { Dashboard } from './types'

import type { GeoJSON } from 'domain/types/GeoJSON'

type OpenPanel = {
  id: number
  type: Dashboard.Block
}

type DashboardType = {
  dashboard: any
  openPanel: OpenPanel | undefined
  regulatoryIdsToBeDisplayed: number[] | []
  [Dashboard.Block.REGULATORY_AREAS]: number[]
  [Dashboard.Block.VIGILANCE_AREAS]: number[]
  [Dashboard.Block.AMP]: number[]
}

type SelectedDashboardType = {
  [key: string]: DashboardType
}

type DashboardState = {
  activeDashboardId: number | undefined
  dashboards: SelectedDashboardType
  extractedArea?: Dashboard.ExtractedArea
  geometry: GeoJSON.Geometry | undefined
  initialGeometry: GeoJSON.Geometry | undefined
  interactionType: InteractionType
  isDrawing: boolean
  isGeometryValid: boolean
}

const INITIAL_STATE: DashboardState = {
  activeDashboardId: 1,
  // TODO: it's just for testing to replace with undefined
  dashboards: {
    1: {
      // TODO: it's just for testing to delete
      dashboard: {},
      openPanel: undefined,
      regulatoryIdsToBeDisplayed: [],
      [Dashboard.Block.REGULATORY_AREAS]: [],
      [Dashboard.Block.VIGILANCE_AREAS]: [],
      [Dashboard.Block.AMP]: []
    }
  },

  extractedArea: undefined,

  geometry: undefined,

  initialGeometry: undefined,

  interactionType: InteractionType.CIRCLE,

  isDrawing: false,
  isGeometryValid: false
}
export const dashboardSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'dashboard',
  reducers: {
    addItems(state, action: PayloadAction<{ itemIds: number[]; type: Dashboard.Block }>) {
      const { itemIds, type } = action.payload
      const id = state.activeDashboardId
      if (!id) {
        return
      }

      if (state.dashboards[id]) {
        const selectedItems = state.dashboards[id][type]
        state.dashboards[id][type] = [...selectedItems, ...itemIds]
      }
    },
    addRegulatoryIdToBeDisplayed(state, action: PayloadAction<number>) {
      const id = state.activeDashboardId

      if (!id || !state.dashboards[id]) {
        return
      }

      const regulatoryIds = state.dashboards[id]?.regulatoryIdsToBeDisplayed
      if (regulatoryIds) {
        state.dashboards[id].regulatoryIdsToBeDisplayed = [...regulatoryIds, action.payload]
      } else {
        state.dashboards[id].regulatoryIdsToBeDisplayed = [action.payload]
      }
    },
    removeAllRegulatoryIdToBeDisplayed(state) {
      const id = state.activeDashboardId

      if (!id || !state.dashboards[id]) {
        return
      }

      state.dashboards[id].regulatoryIdsToBeDisplayed = []
    },
    removeItems(state, action: PayloadAction<{ itemIds: number[]; type: Dashboard.Block }>) {
      const { itemIds, type } = action.payload
      const id = state.activeDashboardId

      if (!id) {
        return
      }

      if (state.dashboards[id]) {
        const selectedItems = state.dashboards[id][type]
        state.dashboards[id][type] = selectedItems.filter(item => !itemIds.includes(item))
      }
    },
    removeRegulatoryIdToBeDisplayed(state, action: PayloadAction<number>) {
      const id = state.activeDashboardId

      if (!id || !state.dashboards[id]) {
        return
      }
      const regulatoryIds = state.dashboards[id]?.regulatoryIdsToBeDisplayed
      if (regulatoryIds) {
        state.dashboards[id].regulatoryIdsToBeDisplayed = regulatoryIds.filter(
          regulatoryId => regulatoryId !== action.payload
        )
      }
    },
    setDashboardPanel(state, action: PayloadAction<OpenPanel | undefined>) {
      const id = state.activeDashboardId

      if (!id) {
        return
      }

      if (state.dashboards[id]) {
        state.dashboards[id].openPanel = action.payload
      }
    },
    setExtractedArea(state, action: PayloadAction<Dashboard.ExtractedArea>) {
      state.extractedArea = action.payload
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
    setIsDrawing(state, action: PayloadAction<boolean>) {
      state.isDrawing = action.payload
    }
  }
})

export const getOpenedPanel = createSelector(
  [
    (state: DashboardState) => state.dashboards,
    (_: DashboardState, dashboard: { id: number; type: Dashboard.Block }) => dashboard
  ],
  (dashboards, dashboard) => {
    const openPanel = dashboards?.[dashboard.id]?.openPanel

    return openPanel?.type === dashboard.type ? openPanel : undefined
  }
)

export const dashboardActions = dashboardSlice.actions
export const dashboardReducer = dashboardSlice.reducer
