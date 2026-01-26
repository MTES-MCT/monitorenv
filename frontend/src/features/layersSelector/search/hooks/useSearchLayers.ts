import { useGetAMPsQuery } from '@api/ampsAPI'
import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { closeMetadataPanel } from '@features/layersSelector/metadataPanel/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import Fuse, { type Expression } from 'fuse.js'
import { debounce } from 'lodash'
import { transformExtent } from 'ol/proj'
import { useCallback, useEffect, useMemo } from 'react'

import { setAMPsSearchResult, setRegulatoryLayersSearchResult } from '../slice'
import { filterByTags, filterByThemes, filterTagsByText, filterThemesByText } from './utils'

import type { AMP } from 'domain/entities/AMPs'
import type { RegulatoryLayerCompact } from 'domain/entities/regulatory'

export function useSearchLayers() {
  const dispatch = useAppDispatch()

  const searchExtent = useAppSelector(state => state.layerSearch.searchExtent)
  const globalSearchText = useAppSelector(state => state.layerSearch.globalSearchText)

  const filteredRegulatoryTags = useAppSelector(state => state.layerSearch.filteredRegulatoryTags)
  const filteredRegulatoryThemes = useAppSelector(state => state.layerSearch.filteredRegulatoryThemes)
  const controlPlan = useAppSelector(state => state.layerSearch.controlPlan)
  const filteredAmpTypes = useAppSelector(state => state.layerSearch.filteredAmpTypes)

  const shouldFilterSearchOnMapExtent = useAppSelector(state => state.layerSearch.shouldFilterSearchOnMapExtent)
  const { zoom } = useAppSelector(state => state.map.mapView)

  const { data: ampsByExtent } = useGetAMPsQuery(
    {
      bbox: searchExtent ? transformExtent(searchExtent, OPENLAYERS_PROJECTION, WSG84_PROJECTION) : undefined,
      withGeometry: true,
      zoom
    },
    { skip: !shouldFilterSearchOnMapExtent }
  )
  const { data: regulatoryLayersByExtent } = useGetRegulatoryLayersQuery(
    {
      bbox: searchExtent ? transformExtent(searchExtent, OPENLAYERS_PROJECTION, WSG84_PROJECTION) : undefined,
      withGeometry: true,
      zoom
    },
    { skip: !shouldFilterSearchOnMapExtent }
  )

  const { data: amps } = useGetAMPsQuery({ withGeometry: false })
  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery({ withGeometry: false })

  const search = useCallback(() => {
    const fuseRegulatory = new Fuse(Object.values(regulatoryLayers?.entities ?? []), {
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
    const fuseAMPs = new Fuse(Object.values(amps?.entities ?? []), {
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

        const searchedAMPIds = shouldFilterSearchOnMapExtent
          ? Object.values(ampsByExtent?.entities ?? []).map(({ id }) => id)
          : fuseAMPs
              ?.search<AMP>({
                $and: filterExpression
              })
              .map(value => value.item.id)
        dispatch(setAMPsSearchResult(searchedAMPIds))
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
        const searchedRegulatoryIds = shouldFilterSearchOnMapExtent
          ? Object.values(regulatoryLayersByExtent?.entities ?? []).map(({ id }) => id)
          : fuseRegulatory
              .search<RegulatoryLayerCompact>({
                $and: filterExpression
              })
              .map(value => value.item.id)

        dispatch(setRegulatoryLayersSearchResult(searchedRegulatoryIds))
      } else {
        dispatch(setRegulatoryLayersSearchResult(undefined))
      }
    }

    dispatch(closeMetadataPanel())
    searchFunction()
  }, [
    amps?.entities,
    ampsByExtent?.entities,
    dispatch,
    filteredAmpTypes,
    filteredRegulatoryTags,
    filteredRegulatoryThemes,
    globalSearchText,
    regulatoryLayers,
    controlPlan,
    regulatoryLayersByExtent?.entities,
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
