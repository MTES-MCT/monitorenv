import { getExtentOfLayersGroup } from '@features/layersSelector/utils/getExtentOfLayersGroup'
import { createEntityAdapter, createSelector, type EntityId, type EntityState } from '@reduxjs/toolkit'
import { boundingExtent, createEmpty } from 'ol/extent'
import { createCachedSelector } from 're-reselect'

import { monitorenvPrivateApi } from './api'

import type { LocalizedArea } from '@features/LocalizedArea/types'

const LocalizedAreasAdapter = createEntityAdapter<LocalizedArea.LocalizedAreaWithBbox>()

const localizedAreasInitialState = LocalizedAreasAdapter.getInitialState()

export const localizedAreasAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: build => ({
    getLocalizedAreas: build.query<EntityState<LocalizedArea.LocalizedAreaWithBbox, number>, void>({
      query: () => '/v1/localized_areas',
      transformResponse: (response: LocalizedArea.LocalizedArea[]) =>
        LocalizedAreasAdapter.setAll(
          localizedAreasInitialState,
          response.map(localizedArea => {
            const bbox = boundingExtent(localizedArea.geom.coordinates.flat().flat() as number[][])

            return {
              ...localizedArea,
              bbox
            }
          })
        )
    })
  })
})

export const { useGetLocalizedAreasQuery } = localizedAreasAPI

export const getLocalizedAreasIdsGroupedByName = createSelector(
  [localizedAreasAPI.endpoints.getLocalizedAreas.select()],
  localizedAreas => {
    const localizedAreasIdsByName = {}
    const localizedAreasEntities = localizedAreas?.data?.entities
    const localizedAreasIds = localizedAreas?.data?.ids
    if (localizedAreasIds && localizedAreasEntities) {
      return localizedAreasIds?.reduce((acc, layerId) => {
        const groupName = localizedAreasEntities[layerId]?.groupName
        if (groupName) {
          acc[groupName] = [...(acc[groupName] ?? []), layerId]
        }

        return acc
      }, {} as { [key: string]: EntityId[] })
    }

    return localizedAreasIdsByName
  }
)

export const getLocalizedAreaIdsByGroupName = createCachedSelector(
  [getLocalizedAreasIdsGroupedByName, (_, groupName: string) => groupName],
  (localizedAreasIdsByName, groupName) => localizedAreasIdsByName?.[groupName]
)((_, groupName: string) => groupName)

export const getExtentOfLocalizedAreasGroupByGroupName = createCachedSelector(
  [localizedAreasAPI.endpoints.getLocalizedAreas.select(), getLocalizedAreaIdsByGroupName],
  (localizedAreasQuery, localizedAreasIdsByName) => {
    const localizedArea = localizedAreasIdsByName
      ?.map(id => localizedAreasQuery.data?.entities[id])
      .filter((area): area is LocalizedArea.LocalizedAreaWithBbox => !!area)
    if (localizedArea) {
      return getExtentOfLayersGroup(localizedArea)
    }

    return createEmpty()
  }
)((_, groupName: string) => groupName)
