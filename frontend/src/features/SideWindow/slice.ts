import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

import { sideWindowPaths } from '../../domain/entities/sideWindow'

import type { EntityState, PayloadAction } from '@reduxjs/toolkit'
import type { BannerStackItem } from 'types'

export const bannerStackAdapter = createEntityAdapter({
  selectId: (bannerStackItem: BannerStackItem) => bannerStackItem.id,
  sortComparer: (a, b) => a.id - b.id
})

export enum SideWindowStatus {
  CLOSED = 'closed',
  HIDDEN = 'hidden',
  VISIBLE = 'visible'
}
export interface SideWindowState {
  bannerStack: EntityState<BannerStackItem, number>
  // TODO Replace with an enum once `sideWindowPaths` is converted to an enum.
  currentPath: string
  hasBeenRenderedOnce: boolean
  showConfirmCancelModal: boolean
  status: string
}
const INITIAL_STATE: SideWindowState = {
  bannerStack: bannerStackAdapter.getInitialState(),
  currentPath: sideWindowPaths.MISSIONS,
  hasBeenRenderedOnce: false,
  showConfirmCancelModal: false,
  status: SideWindowStatus.CLOSED
}

const sideWindowReducerSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'sideWindowReducer',
  reducers: {
    /**
     * Add a banner to the stack.
     *
     * @internal /!\ This action is not meant to be dispatched directly. Use `addSideWindowBanner()` dispatcher instead.
     */
    addBanner(state, action: PayloadAction<BannerStackItem>) {
      bannerStackAdapter.addOne(state.bannerStack, action.payload)
    },

    close(state) {
      state.status = SideWindowStatus.CLOSED
    },

    /**
     * Open the side window and set its route path
     */
    // TODO Replace with an enum once `sideWindowPaths` is converted to an enum.
    focusAndGoTo(state, action: PayloadAction<string>) {
      state.currentPath = action.payload
      state.status = SideWindowStatus.VISIBLE
      state.showConfirmCancelModal = false
    },

    onChangeStatus(state, action: PayloadAction<SideWindowStatus>) {
      state.status = action.payload
    },

    onConfirmCancelModal(state) {
      state.status = SideWindowStatus.VISIBLE
      state.showConfirmCancelModal = false
    },

    /**
     * Remove a banner from the stack.
     *
     * @param action.payload ID of the banner to remove.
     */
    removeBanner(state, action: PayloadAction<number>) {
      bannerStackAdapter.removeOne(state.bannerStack, action.payload)
    },

    removeBanners(state) {
      state.bannerStack = bannerStackAdapter.getInitialState()
    },

    setCurrentPath(state, action: PayloadAction<string>) {
      state.currentPath = action.payload
    },
    setShowConfirmCancelModal(state, action: PayloadAction<boolean>) {
      state.showConfirmCancelModal = action.payload
    }
  }
})

export const sideWindowActions = sideWindowReducerSlice.actions
export const sideWindowReducer = sideWindowReducerSlice.reducer
