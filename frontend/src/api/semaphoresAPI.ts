import { type EntityState, createEntityAdapter } from '@reduxjs/toolkit'

import { monitorenvPrivateApi } from './api'

import type { Semaphore } from '../domain/entities/semaphore'

const SemaphoreAdapter = createEntityAdapter<Semaphore>()
const initialState = SemaphoreAdapter.getInitialState()

export const semaphoresAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: build => ({
    getSemaphores: build.query<EntityState<Semaphore>, void>({
      query: () => '/v1/semaphores',
      transformResponse: (response: Semaphore[]) => SemaphoreAdapter.setAll(initialState, response)
    })
  })
})

export const { useGetSemaphoresQuery } = semaphoresAPI
