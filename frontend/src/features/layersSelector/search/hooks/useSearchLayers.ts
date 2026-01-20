import { useGetAMPsQuery } from '@api/ampsAPI'
import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { closeMetadataPanel } from '@features/layersSelector/metadataPanel/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import Fuse, { type Expression } from 'fuse.js'
import { debounce } from 'lodash'
import { useCallback, useEffect, useMemo } from 'react'

import { setAMPsSearchResult, setRegulatoryLayersSearchResult } from '../slice'
import { filterByTags, filterByThemes, filterTagsByText, filterThemesByText, searchAreaIdsByExtent } from './utils'

import type { AMP } from 'domain/entities/AMPs'
import type { RegulatoryLayerCompact } from 'domain/entities/regulatory'

export function useSearchLayers() {
  const dispatch = useAppDispatch()

  const { data: amps } = useGetAMPsQuery()
  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()
  const searchExtent = useAppSelector(state => state.layerSearch.searchExtent)
  const globalSearchText = useAppSelector(state => state.layerSearch.globalSearchText)

  const filteredRegulatoryTags = useAppSelector(state => state.layerSearch.filteredRegulatoryTags)
  const filteredRegulatoryThemes = useAppSelector(state => state.layerSearch.filteredRegulatoryThemes)
  const controlPlan = useAppSelector(state => state.layerSearch.controlPlan)
  const filteredAmpTypes = useAppSelector(state => state.layerSearch.filteredAmpTypes)

  const shouldFilterSearchOnMapExtent = useAppSelector(state => state.layerSearch.shouldFilterSearchOnMapExtent)

  const search = useCallback(() => {
    const fuseRegulatory = new Fuse((regulatoryLayers?.entities && Object.values(regulatoryLayers?.entities)) || [], {
      ignoreLocation: true,
      includeScore: false,
      keys: [
        'layerName',
        'resume',
        'plan',
        'polyName',
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
    const fuseAMPs = new Fuse((amps?.entities && Object.values(amps?.entities)) || [], {
      ignoreLocation: true,
      includeScore: false,
      keys: ['name', 'type'],
      minMatchCharLength: 2,
      threshold: 0.2
    })

    const searchFunction = () => {
      const shouldSearchByText = globalSearchText?.length > 2
      const shouldSearchThroughAMPTypes = filteredAmpTypes?.length > 0
      const shouldSearchThroughRegulatoryTags = filteredRegulatoryTags?.length > 0
      const shouldSearchThroughRegulatoryThemes = filteredRegulatoryThemes?.length > 0
      const shouldSearchThroughControlPlan = !!controlPlan

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

        const searchedAMPsInExtent = searchAreaIdsByExtent(
          searchExtent,
          searchedAMPS,
          itemSchema.bboxPath,
          itemSchema.idPath,
          shouldFilterSearchOnMapExtent
        )
        dispatch(setAMPsSearchResult(searchedAMPsInExtent))
      } else {
        dispatch(setAMPsSearchResult(undefined))
      }

      if (
        shouldSearchByText ||
        shouldSearchThroughRegulatoryTags ||
        shouldFilterSearchOnMapExtent ||
        shouldSearchThroughRegulatoryThemes ||
        shouldSearchThroughControlPlan
      ) {
        // Regulatory layers
        let searchedRegulatory
        let itemSchema
        if (
          shouldSearchByText ||
          shouldSearchThroughRegulatoryTags ||
          shouldSearchThroughRegulatoryThemes ||
          shouldSearchThroughControlPlan
        ) {
          const filterWithTextExpression = shouldSearchByText
            ? {
                $or: [
                  { $path: ['layerName'], $val: globalSearchText },
                  { $path: ['resume'], $val: globalSearchText },
                  { $path: ['polyName'], $val: globalSearchText },
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
          const filterWithControlPlan = shouldSearchThroughControlPlan
            ? { $or: [{ $path: ['plan'], $val: controlPlan }] }
            : undefined

          const filterExpression = [
            filterWithTextExpression,
            filterWithTags,
            filterWithThemes,
            filterWithControlPlan
          ].filter(f => !!f) as Expression[]

          searchedRegulatory = fuseRegulatory.search<RegulatoryLayerCompact>({
            $and: filterExpression
          })

          itemSchema = { bboxPath: 'item.bbox', idPath: 'item.id' }
        } else {
          searchedRegulatory = regulatoryLayers?.entities && Object.values(regulatoryLayers?.entities)
          itemSchema = { bboxPath: 'bbox', idPath: 'id' }
        }

        const searchedRegulatoryInExtent = searchAreaIdsByExtent(
          searchExtent,
          searchedRegulatory,
          itemSchema.bboxPath,
          itemSchema.idPath,
          shouldFilterSearchOnMapExtent
        )
        dispatch(setRegulatoryLayersSearchResult(searchedRegulatoryInExtent))
      } else {
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
    controlPlan,
    shouldFilterSearchOnMapExtent
  ])

  const debouncedSearchLayers = useMemo(() => debounce(search, 300), [search])

  useEffect(() => {
    debouncedSearchLayers()

    return () => {
      debouncedSearchLayers.cancel()
    }
  }, [debouncedSearchLayers])
}
