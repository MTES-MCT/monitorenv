import { bannerStackAdapter, mainWindowActions } from '../slice'

import type { BannerStackItemProps } from '../types'
import type { HomeAppThunk } from '@store/index'

/**
 * Add a banner to the main window.
 *
 * @param props The props of the `<Banner />` to add.
 * @returns The rank of the added banner (used to remove it if needed).
 */
export const addMainWindowBanner =
  (props: BannerStackItemProps): HomeAppThunk<number> =>
  (dispatch, getState) => {
    const { bannerStack } = getState().mainWindow
    const nextRank = bannerStackAdapter.getSelectors().selectAll(bannerStack).length + 1
    const bannerStackItem = { props, rank: nextRank }

    dispatch(mainWindowActions.addBanner(bannerStackItem))

    return nextRank
  }
