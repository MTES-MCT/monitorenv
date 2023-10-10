import { monitorenvPublicApi } from './api'
import { FrontendApiError } from '../libs/FrontendApiError'

import type { DepartmentArea } from '../domain/entities/departmentArea'

const GET_DEPARTMENT_AREA_ERROR_MESSAGE = "Nous n'avons pas pu récupérer ce département."
const GET_DEPARTMENT_AREAS_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la liste des départements."

export const departmentAreasAPI = monitorenvPublicApi.injectEndpoints({
  endpoints: builder => ({
    getDepartmentArea: builder.query<DepartmentArea.DepartmentArea, number>({
      query: departmentAreaId => `/v1/department_areas/${departmentAreaId}`,
      transformErrorResponse: response => new FrontendApiError(GET_DEPARTMENT_AREA_ERROR_MESSAGE, response)
    }),

    getDepartmentAreas: builder.query<DepartmentArea.DepartmentArea[], void>({
      query: () => `/v1/department_areas`,
      transformErrorResponse: response => new FrontendApiError(GET_DEPARTMENT_AREAS_ERROR_MESSAGE, response)
    })
  })
})

export const { useGetDepartmentAreaQuery, useGetDepartmentAreasQuery } = departmentAreasAPI
