import { bannerStackAdapter } from '../slice'

import type { BannerStackItemProps } from '../components/BannerStack/types'
import type { HomeAppThunk } from '@store/index'

/**
 * Add a banner to the main window.
 *
 * @param props The props of the `<Banner />` to add.
 * @returns The rank of the added banner (used to remove it if needed).
 */
export const addMainWindowBanner =
  (props: BannerStackItemProps): HomeAppThunk<number> =>
  (_, getState) => {
    const { bannerStack } = getState().mainWindow

    const nextRank = bannerStackAdapter.getSelectors().selectAll(bannerStack).length + 1
    const bannerStackItem = { props, rank: nextRank }

    bannerStackAdapter.addOne(bannerStack, bannerStackItem)

    return nextRank
  }
