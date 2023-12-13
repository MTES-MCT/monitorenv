import { monitorenvPrivateApi } from './api'

import type { ControlPlans } from '../domain/entities/controlPlan'

export const controlPlansAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: build => ({
    getControlPlans: build.query<ControlPlans, void>({
      keepUnusedDataFor: 28800, // 8 hours
      query: () => '/v1/control_plans'
    }),
    getControlPlansByYear: build.query<ControlPlans, number>({
      keepUnusedDataFor: 28800, // 8 hours
      query: year => `/v1/control_plans/${year}`
    })
  })
})

export const { useGetControlPlansByYearQuery, useGetControlPlansQuery } = controlPlansAPI
