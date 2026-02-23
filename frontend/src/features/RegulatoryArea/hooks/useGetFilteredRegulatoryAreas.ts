import { useGetRegulatoryAreasQuery } from '@api/regulatoryAreasAPI'
import { getIntersectingLayerIds } from '@features/layersSelector/utils/getIntersectingLayerIds'
import { useAppSelector } from '@hooks/useAppSelector'
import { getTagIds } from '@utils/getTagsAsOptions'
import { getThemeIds } from '@utils/getThemesAsOptions'
import { useMemo } from 'react'

export const useGetFilteredRegulatoryAreas = () => {
  const {
    controlPlan,
    filteredRegulatoryTags,
    filteredRegulatoryThemes,
    globalSearchText,
    searchExtent,
    shouldFilterSearchOnMapExtent
  } = useAppSelector(state => state.layerSearch)

  const apiFilters = useMemo(
    () => ({
      controlPlan,
      searchQuery: globalSearchText,
      tags: getTagIds(filteredRegulatoryTags),
      themes: getThemeIds(filteredRegulatoryThemes)
    }),
    [controlPlan, globalSearchText, filteredRegulatoryTags, filteredRegulatoryThemes]
  )
  const { data, isError, isFetching, isLoading } = useGetRegulatoryAreasQuery(apiFilters)

  const flattenRegulatoryAreas = useMemo(() => {
    if (!data?.regulatoryAreasByLayer) {
      return undefined
    }

    return data.regulatoryAreasByLayer.flatMap(layer => layer.regulatoryAreas)
  }, [data?.regulatoryAreasByLayer])

  let nextRegulatoryAreaIds: number[] | undefined
  if (searchExtent && shouldFilterSearchOnMapExtent) {
    nextRegulatoryAreaIds = getIntersectingLayerIds(shouldFilterSearchOnMapExtent, flattenRegulatoryAreas, searchExtent)
  }

  const results = useMemo(() => {
    if (!nextRegulatoryAreaIds) {
      return {
        regulatoryAreas: data?.regulatoryAreasByLayer || [],
        totalCount: data?.totalCount || 0
      }
    }

    const filteredregulatoryAreas = data?.regulatoryAreasByLayer
      .map(layer => ({
        ...layer,
        regulatoryAreas: layer.regulatoryAreas.filter(area => nextRegulatoryAreaIds?.includes(area.id))
      }))
      .filter(layer => layer.regulatoryAreas.length > 0)

    return {
      regulatoryAreas: filteredregulatoryAreas || [],
      totalCount: filteredregulatoryAreas?.reduce((acc, layer) => acc + layer.regulatoryAreas.length, 0) || 0
    }
  }, [data?.regulatoryAreasByLayer, data?.totalCount, nextRegulatoryAreaIds])

  const filteredAndFlattenRegulatoryAreas = useMemo(() => {
    if (!results.regulatoryAreas) {
      return undefined
    }

    return results.regulatoryAreas.flatMap(layer => layer.regulatoryAreas)
  }, [results.regulatoryAreas])

  return {
    flattenRegulatoryAreas: filteredAndFlattenRegulatoryAreas,
    isError,
    isFetching,
    isLoading,
    regulatoryAreas: results?.regulatoryAreas,
    totalCount: results?.totalCount
  }
}
