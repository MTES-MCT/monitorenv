import { useGetAMPsQuery } from '@api/ampsAPI'
import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { closeMetadataPanel } from '@features/layersSelector/metadataPanel/slice'
import { useGetFilteredVigilanceAreasForMapQuery } from '@features/layersSelector/search/hooks/useGetFilteredVigilanceAreasForMapQuery'
import { getIntersectingLayerIds } from '@features/layersSelector/utils/getIntersectingLayerIds'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import Fuse, { type Expression } from 'fuse.js'
import { debounce } from 'lodash-es'
import { useCallback, useEffect, useMemo } from 'react'

import { setAMPsSearchResult, setRegulatoryLayersSearchResult, setVigilanceAreasSearchResult } from '../slice'
import { filterByTags, filterByThemes, filterTagsByText, filterThemesByText } from './utils'

import type { AMP } from 'domain/entities/AMPs'
import type { RegulatoryLayerCompact } from 'domain/entities/regulatory'

export function useSearchLayers() {
  const dispatch = useAppDispatch()

  const { data: amps } = useGetAMPsQuery()
  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()
  const { vigilanceAreas } = useGetFilteredVigilanceAreasForMapQuery()
  const searchExtent = useAppSelector(state => state.layerSearch.searchExtent)
  const globalSearchText = useAppSelector(state => state.layerSearch.globalSearchText)

  const filteredRegulatoryTags = useAppSelector(state => state.layerSearch.filteredRegulatoryTags)
  const filteredRegulatoryThemes = useAppSelector(state => state.layerSearch.filteredRegulatoryThemes)
  const filteredAmpTypes = useAppSelector(state => state.layerSearch.filteredAmpTypes)

  const shouldFilterSearchOnMapExtent = useAppSelector(state => state.layerSearch.shouldFilterSearchOnMapExtent)

  const search = useCallback(() => {
    const fuseRegulatory = new Fuse((regulatoryLayers?.entities && Object.values(regulatoryLayers?.entities)) || [], {
      ignoreLocation: true,
      includeScore: false,
      keys: [
        'layerName',
        'entityName',
        'refReg',
        'type',
        'tags.name',
        'tags.subTags.name',
        'themes.name',
        'themes.subThemes.name'
      ],
      minMatchCharLength: 2,
      threshold: 0.2
    })
    const fuseAMPs = new Fuse((amps?.entities && Object.values(amps?.entities)) ?? [], {
      ignoreLocation: true,
      includeScore: false,
      keys: ['name', 'type'],
      minMatchCharLength: 2,
      threshold: 0.2
    })

    const fuseVigilanceAreas = new Fuse((vigilanceAreas?.entities && Object.values(vigilanceAreas?.entities)) || [], {
      ignoreLocation: true,
      includeScore: false,
      keys: ['name', 'comments', 'themes', 'tags.name', 'tags.subTags.name', 'themes.name', 'themes.subThemes.name'],
      minMatchCharLength: 2,
      threshold: 0.2
    })

    const searchFunction = () => {
      const shouldSearchByText = globalSearchText?.length > 2
      const shouldSearchThroughAMPTypes = filteredAmpTypes?.length > 0
      const shouldSearchThroughRegulatoryTags = filteredRegulatoryTags?.length > 0
      const shouldSearchThroughRegulatoryThemes = filteredRegulatoryThemes?.length > 0

      const filteredVigilancesAreas = vigilanceAreas?.entities ? Object.values(vigilanceAreas.entities) : []
      const filteredVigilancesAreaIds = filteredVigilancesAreas
        .filter(vigilanceArea => !!vigilanceArea.id)
        .map(({ id }) => id)

      if (shouldSearchByText || shouldSearchThroughAMPTypes || shouldFilterSearchOnMapExtent) {
        let searchedAMPS
        let itemSchema
        if (shouldSearchByText || shouldSearchThroughAMPTypes) {
          const filterWithTextExpression = shouldSearchByText
            ? {
                $or: [
                  { $path: ['name'], $val: globalSearchText },
                  { $path: ['type'], $val: globalSearchText }
                ],
                $val: globalSearchText
              }
            : undefined
          const filterWithType = shouldSearchThroughAMPTypes
            ? { $or: filteredAmpTypes.map(type => ({ $path: 'type', $val: type })) }
            : undefined

          const filterExpression = [filterWithTextExpression, filterWithType].filter(f => !!f) as Expression[]

          searchedAMPS = fuseAMPs?.search<AMP>({
            $and: filterExpression
          })
          itemSchema = { bboxPath: 'item.bbox', idPath: 'item.id' }
        } else {
          searchedAMPS = amps?.entities && Object.values(amps?.entities)
          itemSchema = { bboxPath: 'bbox', idPath: 'id' }
        }
        const searchedAMPsInExtent = getIntersectingLayerIds<AMP>(
          shouldFilterSearchOnMapExtent,
          searchedAMPS,
          searchExtent,
          itemSchema
        )
        dispatch(setAMPsSearchResult(searchedAMPsInExtent))
      } else {
        dispatch(setAMPsSearchResult(undefined))
      }

      if (
        shouldSearchByText ||
        shouldSearchThroughRegulatoryTags ||
        shouldFilterSearchOnMapExtent ||
        shouldSearchThroughRegulatoryThemes
      ) {
        // Regulatory layers
        let searchedRegulatory
        let itemSchema
        if (shouldSearchByText || shouldSearchThroughRegulatoryTags || shouldSearchThroughRegulatoryThemes) {
          const filterWithTextExpression = shouldSearchByText
            ? {
                $or: [
                  { $path: ['layerName'], $val: globalSearchText },
                  { $path: ['entityName'], $val: globalSearchText },
                  { $path: ['refReg'], $val: globalSearchText },
                  { $path: ['type'], $val: globalSearchText },
                  ...filterThemesByText(globalSearchText),
                  ...filterTagsByText(globalSearchText)
                ]
              }
            : undefined

          const filterWithTags = shouldSearchThroughRegulatoryTags ? filterByTags(filteredRegulatoryTags) : undefined

          const filterWithThemes = shouldSearchThroughRegulatoryThemes
            ? filterByThemes(filteredRegulatoryThemes)
            : undefined

          const filterExpression = [filterWithTextExpression, filterWithTags, filterWithThemes].filter(
            f => !!f
          ) as Expression[]
          searchedRegulatory = fuseRegulatory.search<RegulatoryLayerCompact>({
            $and: filterExpression
          })

          itemSchema = { bboxPath: 'item.bbox', idPath: 'item.id' }
        } else {
          searchedRegulatory = regulatoryLayers?.entities && Object.values(regulatoryLayers?.entities)
          itemSchema = { bboxPath: 'bbox', idPath: 'id' }
        }

        const searchedRegulatoryInExtent = getIntersectingLayerIds<RegulatoryLayerCompact>(
          shouldFilterSearchOnMapExtent,
          searchedRegulatory,
          searchExtent,
          itemSchema
        )
        dispatch(setRegulatoryLayersSearchResult(searchedRegulatoryInExtent))

        // Vigilance area layers
        let searchedVigilanceArea
        let vigilanceAreaSchema
        if (shouldSearchByText || shouldSearchThroughRegulatoryTags || shouldSearchThroughRegulatoryThemes) {
          const filterVigilanceAreaWithTextExpression = shouldSearchByText
            ? {
                $or: [
                  { $path: ['name'], $val: globalSearchText },
                  { $path: ['comments'], $val: globalSearchText },
                  ...filterThemesByText(globalSearchText),
                  ...filterTagsByText(globalSearchText)
                ]
              }
            : undefined

          const filterWithTags = shouldSearchThroughRegulatoryTags ? filterByTags(filteredRegulatoryTags) : undefined

          const filterWithThemes = shouldSearchThroughRegulatoryThemes
            ? filterByThemes(filteredRegulatoryThemes)
            : undefined

          const filterExpression = [filterVigilanceAreaWithTextExpression, filterWithTags, filterWithThemes].filter(
            f => !!f
          ) as Expression[]
          const resultSearchVigilanceAreas = fuseVigilanceAreas.search<VigilanceArea.VigilanceAreaLayer>({
            $and: filterExpression
          })

          searchedVigilanceArea =
            filteredVigilancesAreas.length > 0
              ? resultSearchVigilanceAreas.filter(({ item }) => item.id && filteredVigilancesAreaIds.includes(item.id))
              : resultSearchVigilanceAreas
          vigilanceAreaSchema = { bboxPath: 'item.bbox', idPath: 'item.id' }
        } else {
          searchedVigilanceArea = filteredVigilancesAreas
          vigilanceAreaSchema = { bboxPath: 'bbox', idPath: 'id' }
        }

        const searchedVigilanceAreasInExtent = getIntersectingLayerIds<VigilanceArea.VigilanceAreaLayer>(
          shouldFilterSearchOnMapExtent,
          searchedVigilanceArea,
          searchExtent,
          vigilanceAreaSchema
        )
        dispatch(setVigilanceAreasSearchResult(searchedVigilanceAreasInExtent))
      } else {
        dispatch(setVigilanceAreasSearchResult(filteredVigilancesAreaIds))
        dispatch(setRegulatoryLayersSearchResult(undefined))
      }
    }

    dispatch(closeMetadataPanel())
    searchFunction()
  }, [
    amps,
    dispatch,
    filteredAmpTypes,
    filteredRegulatoryTags,
    filteredRegulatoryThemes,
    globalSearchText,
    regulatoryLayers,
    searchExtent,
    shouldFilterSearchOnMapExtent,
    vigilanceAreas
  ])

  const debouncedSearchLayers = useMemo(() => debounce(search, 300), [search])

  useEffect(() => {
    debouncedSearchLayers()

    return () => {
      debouncedSearchLayers.cancel()
    }
  }, [debouncedSearchLayers])
}
