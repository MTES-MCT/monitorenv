import { createEntityAdapter, createSlice, type EntityState, type PayloadAction } from '@reduxjs/toolkit'

import type { BannerStackItem } from './components/BannerStack/types'

export const bannerStackAdapter = createEntityAdapter({
  selectId: (bannerStackItem: BannerStackItem) => bannerStackItem.rank,
  sortComparer: (a, b) => a.rank - b.rank
})

interface MainWindowState {
  bannerStack: EntityState<BannerStackItem>
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
     * Remove a banner from the stack.
     *
     * @param rank The rank of the banner to remove.
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
