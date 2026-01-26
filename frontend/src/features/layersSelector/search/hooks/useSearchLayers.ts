import { useGetAMPsQuery } from '@api/ampsAPI'
import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { closeMetadataPanel } from '@features/layersSelector/metadataPanel/slice'
import { getIntersectingLayerIds } from '@features/layersSelector/utils/getIntersectingLayerIds'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import Fuse, { type Expression } from 'fuse.js'
import { debounce } from 'lodash'
import { useCallback, useEffect, useMemo, useRef } from 'react'

import { setAMPsSearchResult, setRegulatoryLayersSearchResult } from '../slice'
import { filterByTags, filterByThemes, filterTagsByText, filterThemesByText } from './utils'

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
  const filteredAmpTypes = useAppSelector(state => state.layerSearch.filteredAmpTypes)
  const controlPlan = useAppSelector(state => state.layerSearch.controlPlan)
  const shouldFilterSearchOnMapExtent = useAppSelector(state => state.layerSearch.shouldFilterSearchOnMapExtent)

  /* ------------------------------------------------------------------ */
  /* Fuse instances (STABLES)                                            */
  /* ------------------------------------------------------------------ */

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

    return new Fuse(Object.values(regulatoryLayers.entities), {
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
  }, [regulatoryLayers])

  /* ------------------------------------------------------------------ */
  /* Core search logic                                                   */
  /* ------------------------------------------------------------------ */

  const runSearch = useCallback(() => {
    const shouldSearchByText = globalSearchText?.length > 2
    const shouldSearchThroughAMPTypes = filteredAmpTypes?.length > 0
    const shouldSearchThroughRegulatoryTags = filteredRegulatoryTags?.length > 0
    const shouldSearchThroughRegulatoryThemes = filteredRegulatoryThemes?.length > 0
    const shouldSearchThroughControlPlan = !!controlPlan

    dispatch(closeMetadataPanel())

    /* ----------------------------- AMPs ------------------------------ */

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
        searchedAMPs = amps?.entities && Object.values(amps.entities)
        itemSchema = { bboxPath: 'bbox', idPath: 'id' }
      }

      dispatch(
        setAMPsSearchResult(
          getIntersectingLayerIds(shouldFilterSearchOnMapExtent, searchedAMPs, searchExtent, itemSchema)
        )
      )
    } else {
      dispatch(setAMPsSearchResult(undefined))
    }

    /* ----------------------- Regulatory layers ----------------------- */

    if (
      shouldSearchByText ||
      shouldSearchThroughRegulatoryTags ||
      shouldSearchThroughRegulatoryThemes ||
      shouldSearchThroughControlPlan ||
      shouldFilterSearchOnMapExtent
    ) {
      let searchedRegulatory
      let itemSchema

      if (fuseRegulatory) {
        const filterExpression: Expression[] = [
          shouldSearchByText && {
            $or: [
              { $path: ['layerName'], $val: globalSearchText },
              { $path: ['resume'], $val: globalSearchText },
              { $path: ['polyName'], $val: globalSearchText },
              { $path: ['refReg'], $val: globalSearchText },
              { $path: ['type'], $val: globalSearchText },
              ...filterThemesByText(globalSearchText),
              ...filterTagsByText(globalSearchText)
            ]
          },
          shouldSearchThroughRegulatoryTags && filterByTags(filteredRegulatoryTags),
          shouldSearchThroughRegulatoryThemes && filterByThemes(filteredRegulatoryThemes),
          shouldSearchThroughControlPlan && {
            $or: [{ $path: ['plan'], $val: controlPlan }]
          }
        ].filter(Boolean) as Expression[]

        searchedRegulatory = fuseRegulatory.search<RegulatoryLayerCompact>({
          $and: filterExpression
        })

        itemSchema = { bboxPath: 'item.bbox', idPath: 'item.id' }
      } else {
        searchedRegulatory = regulatoryLayers?.entities && Object.values(regulatoryLayers.entities)
        itemSchema = { bboxPath: 'bbox', idPath: 'id' }
      }

      dispatch(
        setRegulatoryLayersSearchResult(
          getIntersectingLayerIds(shouldFilterSearchOnMapExtent, searchedRegulatory, searchExtent, itemSchema)
        )
      )
    } else {
      dispatch(setRegulatoryLayersSearchResult(undefined))
    }
  }, [
    amps,
    fuseAMPs,
    fuseRegulatory,
    filteredAmpTypes,
    filteredRegulatoryTags,
    filteredRegulatoryThemes,
    globalSearchText,
    regulatoryLayers,
    searchExtent,
    controlPlan,
    shouldFilterSearchOnMapExtent,
    dispatch
  ])

  /* ------------------------------------------------------------------ */
  /* Debounce STABLE                                                     */
  /* ------------------------------------------------------------------ */

  const debouncedSearchRef = useRef(debounce((fn: () => void) => fn(), 300))

  useEffect(() => {
    debouncedSearchRef.current(runSearch)

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      debouncedSearchRef.current.cancel()
    }
  }, [runSearch])
}
