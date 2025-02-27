import { monitorenvPrivateApi } from './api'

import type { RecentActivity } from '@features/RecentActivity/types'

export const recentActivityAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: build => ({
    getRecentControlsActivity: build.mutation<RecentActivity.RecentControlsActivity[], RecentActivity.Filters>({
      query: filters => ({
        body: filters,
        method: 'POST',
        url: '/v1/recent-activity/controls'
      })
    })
  })
})

export const { useGetRecentControlsActivityMutation } = recentActivityAPI
