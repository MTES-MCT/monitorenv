import { type Option } from '@mtes-mct/monitor-ui'
import Fuse, { type Expression } from 'fuse.js'
import _ from 'lodash'
import { useState, useMemo } from 'react'
import styled from 'styled-components'

import { LayerFilters } from './LayerFilters'
import { ResultList } from './ResultsList'
import { SearchInput } from './SearchInput'
import { SearchOnExtentExtraButtons } from './SearchOnExtentExtraButtons'
import {
  setAMPsSearchResult,
  setFilteredAmpTypes,
  setFilteredRegulatoryThemes,
  setGlobalSearchText,
  setRegulatoryLayersSearchResult
} from './slice'
import { useGetAMPsQuery } from '../../../api/ampsAPI'
import { useGetRegulatoryLayersQuery } from '../../../api/regulatoryLayersAPI'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { getIntersectingLayerIds } from '../utils/getIntersectingLayerIds'

import type { AMP } from '../../../domain/entities/AMPs'
import type { RegulatoryLayerCompact } from '../../../domain/entities/regulatory'

export function LayerSearch() {
  const dispatch = useAppDispatch()
  const { data: amps } = useGetAMPsQuery()
  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()
  const ampsSearchResult = useAppSelector(state => state.layerSearch.ampsSearchResult)
  const regulatoryLayersSearchResult = useAppSelector(state => state.layerSearch.regulatoryLayersSearchResult)
  const searchExtent = useAppSelector(state => state.layerSearch.searchExtent)
  const globalSearchText = useAppSelector(state => state.layerSearch.globalSearchText)
  const filteredRegulatoryThemes = useAppSelector(state => state.layerSearch.filteredRegulatoryThemes)
  const filteredAmpTypes = useAppSelector(state => state.layerSearch.filteredAmpTypes)
  const shouldFilterSearchOnMapExtent = useAppSelector(state => state.layerSearch.shouldFilterSearchOnMapExtent)

  const [displayRegFilters, setDisplayRegFilters] = useState<boolean>(false)

  const debouncedSearchLayers = useMemo(() => {
    const fuseRegulatory = new Fuse((regulatoryLayers?.entities && Object.values(regulatoryLayers?.entities)) || [], {
      ignoreLocation: true,
      includeScore: false,
      keys: ['layer_name', 'entity_name', 'ref_reg', 'type', 'thematique'],
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

    const searchFunction = async ({
      ampTypes,
      extent,
      regulatoryThemes,
      searchedText,
      shouldSearchByExtent
    }: {
      ampTypes: string[]
      extent: number[] | undefined
      regulatoryThemes: string[]
      searchedText: string
      shouldSearchByExtent: boolean
    }) => {
      const shouldSearchByText = searchedText?.length > 2
      const shouldSeachTroughAMPTypes = ampTypes?.length > 0
      const shouldSearchThroughRegulatoryThemes = regulatoryThemes?.length > 0

      if (shouldSearchByText || shouldSeachTroughAMPTypes || shouldSearchByExtent) {
        let searchedAMPS
        let itemSchema
        if (shouldSearchByText || shouldSeachTroughAMPTypes) {
          const filterWithTextExpression = shouldSearchByText ? { $path: ['name'], $val: searchedText } : undefined
          const filterWithType = shouldSeachTroughAMPTypes
            ? { $or: ampTypes.map(theme => ({ $path: 'type', $val: theme })) }
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
          shouldSearchByExtent,
          searchedAMPS,
          extent,
          itemSchema
        )
        dispatch(setAMPsSearchResult(searchedAMPsInExtent))
      } else {
        dispatch(setAMPsSearchResult([]))
      }

      if (shouldSearchByText || shouldSearchThroughRegulatoryThemes || shouldSearchByExtent) {
        let searchedRegulatory
        let itemSchema
        if (shouldSearchByText || shouldSearchThroughRegulatoryThemes) {
          const filterWithTextExpression = shouldSearchByText
            ? {
                $or: [
                  { $path: ['layer_name'], $val: searchedText },
                  { $path: ['entity_name'], $val: searchedText },
                  { $path: ['ref_reg'], $val: searchedText },
                  { $path: ['type'], $val: searchedText }
                ]
              }
            : undefined

          const filterWithTheme = shouldSearchThroughRegulatoryThemes
            ? { $or: regulatoryThemes.map(theme => ({ $path: ['thematique'], $val: theme })) }
            : undefined

          const filterExpression = [filterWithTextExpression, filterWithTheme].filter(f => !!f) as Expression[]
          searchedRegulatory = fuseRegulatory.search<RegulatoryLayerCompact>({
            $and: filterExpression
          })

          itemSchema = { bboxPath: 'item.bbox', idPath: 'item.id' }
        } else {
          searchedRegulatory = regulatoryLayers?.entities && Object.values(regulatoryLayers?.entities)
          itemSchema = { bboxPath: 'bbox', idPath: 'id' }
        }

        const searchedRegulatoryInExtent = getIntersectingLayerIds<RegulatoryLayerCompact>(
          shouldSearchByExtent,
          searchedRegulatory,
          extent,
          itemSchema
        )
        dispatch(setRegulatoryLayersSearchResult(searchedRegulatoryInExtent))
      } else {
        dispatch(setRegulatoryLayersSearchResult([]))
      }
    }

    return _.debounce(searchFunction, 300, { trailing: true })
  }, [dispatch, regulatoryLayers, amps])

  const handleSearchInputChange = searchedText => {
    dispatch(setGlobalSearchText(searchedText))
    debouncedSearchLayers({
      ampTypes: filteredAmpTypes,
      extent: searchExtent,
      regulatoryThemes: filteredRegulatoryThemes,
      searchedText,
      shouldSearchByExtent: shouldFilterSearchOnMapExtent
    })
  }

  const handleSetFilteredAmpTypes = filteredTypes => {
    dispatch(setFilteredAmpTypes(filteredTypes))
    debouncedSearchLayers({
      ampTypes: filteredTypes,
      extent: searchExtent,
      regulatoryThemes: filteredRegulatoryThemes,
      searchedText: globalSearchText,
      shouldSearchByExtent: shouldFilterSearchOnMapExtent
    })
  }

  const handleSetFilteredRegulatoryThemes = filteredThemes => {
    dispatch(setFilteredRegulatoryThemes(filteredThemes))
    debouncedSearchLayers({
      ampTypes: filteredAmpTypes,
      extent: searchExtent,
      regulatoryThemes: filteredThemes,
      searchedText: globalSearchText,
      shouldSearchByExtent: shouldFilterSearchOnMapExtent
    })
  }

  const handleResetFilters = () => {
    dispatch(setFilteredRegulatoryThemes([]))
    dispatch(setFilteredAmpTypes([]))
    debouncedSearchLayers({
      ampTypes: [],
      extent: searchExtent,
      regulatoryThemes: [],
      searchedText: globalSearchText,
      shouldSearchByExtent: shouldFilterSearchOnMapExtent
    })
  }

  const toggleRegFilters = () => {
    setDisplayRegFilters(!displayRegFilters)
  }

  const ampTypes = useMemo(
    () =>
      _.chain(amps?.entities)
        .map(l => l?.type)
        .uniq()
        .map(l => ({ label: l, value: l }))
        .sortBy('label')
        .value() as Option<string>[],
    [amps]
  )

  const regulatoryThemes = useMemo(
    () =>
      _.chain(regulatoryLayers?.entities)
        .filter(l => !!l?.thematique)
        .map(l => l?.thematique.split(','))
        .flatMap(l => l)
        .uniq()
        .filter(l => !!l)
        .map(l => ({ label: l, value: l }))
        .sortBy('label')
        .value() as Option<string>[],
    [regulatoryLayers]
  )
  const allowResetResults = !_.isEmpty(regulatoryLayersSearchResult) || !_.isEmpty(ampsSearchResult)

  return (
    <>
      <Search>
        <SearchInput
          displayRegFilters={displayRegFilters}
          filteredAmpTypes={filteredAmpTypes}
          filteredRegulatoryThemes={filteredRegulatoryThemes}
          globalSearchText={globalSearchText}
          placeholder="Rechercher une zone"
          setGlobalSearchText={handleSearchInputChange}
          toggleRegFilters={toggleRegFilters}
        />
        {displayRegFilters && (
          <LayerFilters
            ampTypes={ampTypes}
            filteredAmpTypes={filteredAmpTypes}
            filteredRegulatoryThemes={filteredRegulatoryThemes}
            handleResetFilters={handleResetFilters}
            regulatoryThemes={regulatoryThemes}
            setFilteredAmpTypes={handleSetFilteredAmpTypes}
            setFilteredRegulatoryThemes={handleSetFilteredRegulatoryThemes}
          />
        )}
        <ResultList searchedText={globalSearchText} />
      </Search>

      <SearchOnExtentExtraButtons allowResetResults={allowResetResults} debouncedSearchLayers={debouncedSearchLayers} />
    </>
  )
}

const Search = styled.div`
  width: 352px;
`
