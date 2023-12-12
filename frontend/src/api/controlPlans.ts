import { monitorenvPrivateApi } from './api'

import type { ControlPlans } from '../domain/entities/controlPlan'

export const controlPlansAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: build => ({
    getControlPlans: build.query<ControlPlans, void>({
      query: () => '/v1/control_plans'
    }),
    getControlPlansByYear: build.query<ControlPlans, number>({
      query: year => `/v1/control_plans/${year}`
    })
  })
})

export const { useGetControlPlansByYearQuery, useGetControlPlansQuery } = controlPlansAPI
