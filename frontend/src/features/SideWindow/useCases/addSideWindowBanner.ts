import { bannerStackAdapter, sideWindowActions } from '../slice'

import type { HomeAppThunk } from '@store/index'
import type { BannerStackItem, BannerStackItemProps } from 'types'

/**
 * Add a banner to the main window.
 *
 * @param props Component props of the `<Banner />` to add.
 * @returns ID of the added banner (used to remove it if needed).
 */
export const addSideWindowBanner =
  (props: BannerStackItemProps): HomeAppThunk<number> =>
  (dispatch, getState) => {
    const { bannerStack } = getState().mainWindow
    const nextId = bannerStackAdapter.getSelectors().selectTotal(bannerStack) + 1
    const bannerStackItem: BannerStackItem = { id: nextId, props }

    dispatch(sideWindowActions.addBanner(bannerStackItem))

    return nextId
  }
