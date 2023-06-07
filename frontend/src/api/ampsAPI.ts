import { EntityState, createEntityAdapter } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { boundingExtent } from 'ol/extent'

import type { AMP, AMPFromAPI } from '../domain/entities/AMPs'
import type { Coordinate } from 'ol/coordinate'

const AMPAdapter = createEntityAdapter<AMP>()

const initialState = AMPAdapter.getInitialState()

export const ampsAPI = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/bff/v1' }),
  endpoints: build => ({
    getAMPs: build.query<EntityState<AMP>, void>({
      query: () => `amps`,
      transformResponse: (response: AMPFromAPI[]) =>
        AMPAdapter.setAll(
          initialState,
          response.map(amp => {
            const bbox = boundingExtent(amp.geom.coordinates.flat().flat() as Coordinate[])

            return {
              ...amp,
              bbox
            }
          })
        )
    })
  }),
  reducerPath: 'amps'
})

export const { useGetAMPsQuery } = ampsAPI
