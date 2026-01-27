import { useGetAMPsQuery } from '@api/ampsAPI'
import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { closeMetadataPanel } from '@features/layersSelector/metadataPanel/slice'
import { getIntersectingLayerIds } from '@features/layersSelector/utils/getIntersectingLayerIds'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import Fuse, { type Expression } from 'fuse.js'
import { debounce } from 'lodash'
import { useCallback, useEffect, useMemo, useRef, type MutableRefObject } from 'react'

import { setAMPsSearchResult, setRegulatoryLayersSearchResult } from '../slice'
import { areArraysEqual, buildRegulatoryAreaSearchText } from './utils'

import type { AMP } from 'domain/entities/AMPs'
import type { RegulatoryLayerCompact } from 'domain/entities/regulatory'

function applyRegulatoryAreasFilters(items, params) {
  const { controlPlan, filteredRegulatoryTags, filteredRegulatoryThemes } = params

  return items.filter(item => {
    if (controlPlan && item.plan?.includes(controlPlan) === false) {
      return false
    }

    if (filteredRegulatoryTags.length && !filteredRegulatoryTags.some(t => item.tags.some(tag => tag.id === t.id))) {
      return false
    }
    if (
      filteredRegulatoryThemes.length &&
      !filteredRegulatoryThemes.some(t => item.themes.some(theme => theme.id === t.id))
    ) {
      return false
    }

    return true
  })
}

export function useSearchLayers() {
  const dispatch = useAppDispatch()

  const lastAMPsResultRef = useRef<number[] | undefined>()
  const lastRegulatoryResultRef = useRef<number[] | undefined>()

  const { data: amps } = useGetAMPsQuery()
  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()

  const searchExtent = useAppSelector(state => state.layerSearch.searchExtent)
  const globalSearchText = useAppSelector(state => state.layerSearch.globalSearchText)

  const filteredRegulatoryTags = useAppSelector(state => state.layerSearch.filteredRegulatoryTags)
  const filteredRegulatoryThemes = useAppSelector(state => state.layerSearch.filteredRegulatoryThemes)
  const filteredAmpTypes = useAppSelector(state => state.layerSearch.filteredAmpTypes)
  const controlPlan = useAppSelector(state => state.layerSearch.controlPlan)
  const shouldFilterSearchOnMapExtent = useAppSelector(state => state.layerSearch.shouldFilterSearchOnMapExtent)

  const fuseAMPs = useMemo(() => {
    if (!amps?.entities) {
      return null
    }

    return new Fuse(Object.values(amps.entities), {
      ignoreLocation: true,
      includeScore: false,
      keys: ['name', 'type'],
      minMatchCharLength: 2,
      threshold: 0.2
    })
  }, [amps])

  const fuseRegulatory = useMemo(() => {
    if (!regulatoryLayers?.entities) {
      return null
    }

    const regulatoryList = Object.values(regulatoryLayers.entities).map(layer => ({
      ...layer,
      searchText: buildRegulatoryAreaSearchText(layer)
    }))

    return new Fuse(regulatoryList, {
      ignoreLocation: true,
      includeScore: false,
      keys: ['searchText'],
      minMatchCharLength: 2,
      threshold: 0.2
    })
  }, [regulatoryLayers])

  const dispatchIfChanged = useCallback(
    (
      next: number[] | undefined,
      ref: MutableRefObject<number[] | undefined>,
      action: (payload: number[] | undefined) => any
    ) => {
      if (!areArraysEqual(ref.current, next)) {
        // eslint-disable-next-line no-param-reassign
        ref.current = next
        dispatch(action(next))
      }
    },
    [dispatch]
  )

  const runSearch = useCallback(() => {
    const shouldSearchByText = !!globalSearchText && globalSearchText.length > 2
    const shouldSearchThroughAMPTypes = filteredAmpTypes.length > 0
    const shouldSearchThroughRegulatoryTags = filteredRegulatoryTags.length > 0
    const shouldSearchThroughRegulatoryThemes = filteredRegulatoryThemes.length > 0
    const shouldSearchThroughControlPlan = !!controlPlan

    dispatch(closeMetadataPanel())

    // AMPS
    if (shouldSearchByText || shouldSearchThroughAMPTypes || shouldFilterSearchOnMapExtent) {
      let searchedAMPs
      let itemSchema

      if ((shouldSearchByText || shouldSearchThroughAMPTypes) && fuseAMPs) {
        const filterExpression: Expression[] = [
          shouldSearchByText && {
            $or: [
              { $path: ['name'], $val: globalSearchText },
              { $path: ['type'], $val: globalSearchText }
            ]
          },
          shouldSearchThroughAMPTypes && {
            $or: filteredAmpTypes.map(type => ({
              $path: 'type',
              $val: type
            }))
          }
        ].filter(Boolean) as Expression[]

        searchedAMPs = fuseAMPs.search<AMP>({ $and: filterExpression })
        itemSchema = { bboxPath: 'item.bbox', idPath: 'item.id' }
      } else {
        searchedAMPs = amps?.entities ? Object.values(amps.entities) : undefined
        itemSchema = { bboxPath: 'bbox', idPath: 'id' }
      }

      const nextAMPsResult = getIntersectingLayerIds(
        shouldFilterSearchOnMapExtent,
        searchedAMPs,
        searchExtent,
        itemSchema
      )

      dispatchIfChanged(nextAMPsResult, lastAMPsResultRef, setAMPsSearchResult)
    } else {
      dispatchIfChanged(undefined, lastAMPsResultRef, setAMPsSearchResult)
    }

    // Regulatory Layers
    if (
      shouldSearchByText ||
      shouldSearchThroughRegulatoryTags ||
      shouldSearchThroughRegulatoryThemes ||
      shouldSearchThroughControlPlan ||
      shouldFilterSearchOnMapExtent
    ) {
      let searchedRegulatory

      if (shouldSearchByText && fuseRegulatory) {
        const filterExpression: Expression[] = [
          {
            $or: [{ $path: ['searchText'], $val: globalSearchText }]
          }
        ].filter(Boolean) as Expression[]

        searchedRegulatory = fuseRegulatory.search<RegulatoryLayerCompact>({ $and: filterExpression }).map(r => r.item)
      } else {
        searchedRegulatory = regulatoryLayers?.entities ? Object.values(regulatoryLayers.entities) : undefined
      }
      searchedRegulatory = applyRegulatoryAreasFilters(searchedRegulatory, {
        controlPlan,
        filteredRegulatoryTags,
        filteredRegulatoryThemes
      })
      const nextRegulatoryResult = getIntersectingLayerIds(
        shouldFilterSearchOnMapExtent,
        searchedRegulatory,
        searchExtent
      )

      dispatchIfChanged(nextRegulatoryResult, lastRegulatoryResultRef, setRegulatoryLayersSearchResult)
    } else {
      dispatchIfChanged(undefined, lastRegulatoryResultRef, setRegulatoryLayersSearchResult)
    }
  }, [
    amps,
    regulatoryLayers,
    fuseAMPs,
    fuseRegulatory,
    globalSearchText,
    filteredAmpTypes,
    filteredRegulatoryTags,
    filteredRegulatoryThemes,
    controlPlan,
    searchExtent,
    shouldFilterSearchOnMapExtent,
    dispatch,
    dispatchIfChanged
  ])

  const debouncedSearchRef = useRef(
    debounce((search: () => void) => {
      search()
    }, 300)
  )

  useEffect(() => {
    debouncedSearchRef.current(runSearch)

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      debouncedSearchRef.current.cancel()
    }
  }, [runSearch])
}
