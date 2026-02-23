import { useGetAMPsQuery } from '@api/ampsAPI'
import { closeMetadataPanel } from '@features/layersSelector/metadataPanel/slice'
import { getIntersectingLayerIds } from '@features/layersSelector/utils/getIntersectingLayerIds'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import Fuse, { type Expression } from 'fuse.js'
import { debounce } from 'lodash'
import { useCallback, useEffect, useMemo, useRef, type MutableRefObject } from 'react'

import { setAMPsSearchResult } from '../slice'
import { areArraysEqual } from './utils'

import type { AMP } from 'domain/entities/AMPs'

export function useSearchLayers() {
  const dispatch = useAppDispatch()

  const lastAMPsResultRef = useRef<number[] | undefined>()

  const searchExtent = useAppSelector(state => state.layerSearch.searchExtent)
  const globalSearchText = useAppSelector(state => state.layerSearch.globalSearchText)

  const filteredAmpTypes = useAppSelector(state => state.layerSearch.filteredAmpTypes)
  const shouldFilterSearchOnMapExtent = useAppSelector(state => state.layerSearch.shouldFilterSearchOnMapExtent)

  const { data: amps } = useGetAMPsQuery()

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
    /*     const shouldSearchThroughRegulatoryTags = filteredRegulatoryTags.length > 0
    const shouldSearchThroughRegulatoryThemes = filteredRegulatoryThemes.length > 0
    const shouldSearchThroughControlPlan = !!controlPlan */

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
  }, [
    globalSearchText,
    filteredAmpTypes,
    dispatch,
    shouldFilterSearchOnMapExtent,
    fuseAMPs,
    searchExtent,
    dispatchIfChanged,
    amps?.entities
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
