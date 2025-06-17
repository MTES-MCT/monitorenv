import { backOfficeActions, bannerStackAdapter } from '../slice'

import type { HomeAppThunk } from '@store/index'
import type { BannerStackItem, BannerStackItemProps } from 'types'

/**
 * Add a banner to the back office.
 *
 * @param props Component props of the `<Banner />` to add.
 * @returns ID of the added banner (used to remove it if needed).
 */
export const addBackOfficeBanner =
  (props: BannerStackItemProps): HomeAppThunk<number> =>
  (dispatch, getState) => {
    const { bannerStack } = getState().backOffice
    const nextId = bannerStackAdapter.getSelectors().selectTotal(bannerStack) + 1
    const bannerStackItem: BannerStackItem = { id: nextId, props }

    dispatch(backOfficeActions.addBanner(bannerStackItem))

    return nextId
  }
