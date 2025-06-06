import { createEntityAdapter, createSlice, type EntityState, type PayloadAction } from '@reduxjs/toolkit'

import type { BannerStackItem } from 'types'

export const bannerStackAdapter = createEntityAdapter({
  selectId: (bannerStackItem: BannerStackItem) => bannerStackItem.id,
  sortComparer: (a, b) => a.id - b.id
})

interface MainWindowState {
  bannerStack: EntityState<BannerStackItem, number>
  hasFullHeightRightDialogOpen: boolean
  isRightMenuOpened: boolean
}
const INITIAL_STATE: MainWindowState = {
  bannerStack: bannerStackAdapter.getInitialState(),
  hasFullHeightRightDialogOpen: false,
  isRightMenuOpened: false
}

const mainWindowSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'mainWindow',
  reducers: {
    /**
     * Add a banner to the stack.
     *
     * @internal /!\ This action is not meant to be dispatched directly. Use `addMainWindowBanner()` dispatcher instead.
     */
    addBanner(state, action: PayloadAction<BannerStackItem>) {
      bannerStackAdapter.addOne(state.bannerStack, action.payload)
    },

    /**
     * Remove a banner from the stack.
     *
     * @param action.payload ID of the banner to remove.
     */
    removeBanner(state, action: PayloadAction<number>) {
      bannerStackAdapter.removeOne(state.bannerStack, action.payload)
    },

    setHasFullHeightRightDialogOpen(state, action: PayloadAction<boolean>) {
      state.hasFullHeightRightDialogOpen = action.payload
    },

    setIsRightMenuOpened(state, action: PayloadAction<boolean>) {
      state.isRightMenuOpened = action.payload
    }
  }
})

export const mainWindowActions = mainWindowSlice.actions
export const mainWindowReducer = mainWindowSlice.reducer
