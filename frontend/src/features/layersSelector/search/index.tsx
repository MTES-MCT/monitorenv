import { type Option, Accent, Icon, IconButton, Button, Size } from '@mtes-mct/monitor-ui'
import Fuse, { type Expression } from 'fuse.js'
import _ from 'lodash'
import { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'

import { LayerFilters } from './LayerFilters'
import { ResultList } from './ResultsList'
import { SearchInput } from './SearchInput'
import { resetSearchExtent, setAMPsSearchResult, setRegulatoryLayersSearchResult, setSearchExtent } from './slice'
import { useGetAMPsQuery } from '../../../api/ampsAPI'
import { useGetRegulatoryLayersQuery } from '../../../api/regulatoryLayersAPI'
import { setFitToExtent } from '../../../domain/shared_slices/Map'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { getIntersectingLayerIds } from '../utils/getIntersectingLayerIds'

import type { AMP } from '../../../domain/entities/AMPs'
import type { RegulatoryLayerCompact } from '../../../domain/entities/regulatory'

export function LayerSearch({ isVisible }: { isVisible: boolean }) {
  const dispatch = useAppDispatch()
  const { data: amps } = useGetAMPsQuery()
  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()
  const ampsSearchResult = useAppSelector(state => state.layerSearch.ampsSearchResult)
  const regulatoryLayersSearchResult = useAppSelector(state => state.layerSearch.regulatoryLayersSearchResult)
  const currentMapExtentTracker = useAppSelector(state => state.map.currentMapExtentTracker)

  const [shouldReloadSearchOnExtent, setShouldReloadSearchOnExtent] = useState<boolean>(false)
  const [displayRegFilters, setDisplayRegFilters] = useState<boolean>(false)

  const [globalSearchText, setGlobalSearchText] = useState<string>('')
  const [filteredRegulatoryThemes, setFilteredRegulatoryThemes] = useState<string[]>([])
  const [filteredAmpTypes, setFilteredAmpTypes] = useState<string[]>([])

  const [filterSearchOnMapExtent, setFilterSearchOnMapExtent] = useState<boolean>(false)

  // const isSearchThrottled = useRef(false)

  useEffect(() => {
    if (filterSearchOnMapExtent) {
      setShouldReloadSearchOnExtent(true)
    } else {
      setShouldReloadSearchOnExtent(false)
    }
  }, [filterSearchOnMapExtent, currentMapExtentTracker])

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
      geofilter,
      regulatoryThemes,
      searchedText
    }: {
      ampTypes: string[]
      extent: number[] | undefined
      geofilter: boolean
      regulatoryThemes: string[]
      searchedText: string
    }) => {
      if (searchedText?.length > 2 || ampTypes?.length > 0 || geofilter) {
        let searchedAMPS
        let itemSchema
        if (searchedText?.length > 2 || ampTypes?.length > 0) {
          const filterWithTextExpression =
            searchedText?.length > 0 ? { $path: ['name'], $val: searchedText } : undefined
          const filterWithType =
            ampTypes?.length > 0 ? { $or: ampTypes.map(theme => ({ $path: 'type', $val: theme })) } : undefined

          const filterExpression = [filterWithTextExpression, filterWithType].filter(f => !!f) as Fuse.Expression[]

          searchedAMPS = fuseAMPs?.search<AMP>({
            $and: filterExpression
          })
          itemSchema = { bboxPath: 'item.bbox', idPath: 'item.id' }
        } else {
          searchedAMPS = amps?.entities && Object.values(amps?.entities)
          itemSchema = { bboxPath: 'bbox', idPath: 'id' }
        }
        const searchedAMPsInExtent = getIntersectingLayerIds<AMP>(geofilter, searchedAMPS, extent, itemSchema)
        dispatch(setAMPsSearchResult(searchedAMPsInExtent))
      } else {
        dispatch(setAMPsSearchResult([]))
      }

      if (searchedText?.length > 2 || regulatoryThemes?.length > 0 || geofilter) {
        let searchedRegulatory
        let itemSchema
        if (searchedText?.length > 2 || regulatoryThemes?.length > 0) {
          const filterWithTextExpression =
            searchedText?.length > 0
              ? {
                  $or: [
                    { $path: ['layer_name'], $val: searchedText },
                    { $path: ['entity_name'], $val: searchedText },
                    { $path: ['ref_reg'], $val: searchedText },
                    { $path: ['type'], $val: searchedText }
                  ]
                }
              : undefined

          const filterWithTheme =
            regulatoryThemes?.length > 0
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
          geofilter,
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

  // const debouncedSearchLayers = useCallback(_.debounce(memoizedSearchFunction, 1300, { trailing: true }), [])

  const handleReloadSearch = () => {
    setShouldReloadSearchOnExtent(false)
    debouncedSearchLayers({
      ampTypes: filteredAmpTypes,
      extent: currentMapExtentTracker,
      geofilter: filterSearchOnMapExtent,
      regulatoryThemes: filteredRegulatoryThemes,
      searchedText: globalSearchText
    })
    dispatch(setSearchExtent(currentMapExtentTracker))
    dispatch(setFitToExtent(currentMapExtentTracker))
  }

  const handleResetSearch = () => {
    dispatch(setRegulatoryLayersSearchResult([]))
    dispatch(setAMPsSearchResult([]))
    setShouldReloadSearchOnExtent(false)
    setFilterSearchOnMapExtent(false)
    setGlobalSearchText('')
    setFilteredRegulatoryThemes([])
    dispatch(resetSearchExtent())
  }

  const handleSearchInputChange = searchedText => {
    setGlobalSearchText(searchedText)
    debouncedSearchLayers({
      ampTypes: filteredAmpTypes,
      extent: currentMapExtentTracker,
      geofilter: filterSearchOnMapExtent,
      regulatoryThemes: filteredRegulatoryThemes,
      searchedText
    })
  }

  const handleSetFilteredAmpTypes = filteredTypes => {
    setFilteredAmpTypes(filteredTypes)
    debouncedSearchLayers({
      ampTypes: filteredTypes,
      extent: currentMapExtentTracker,
      geofilter: filterSearchOnMapExtent,
      regulatoryThemes: filteredRegulatoryThemes,
      searchedText: globalSearchText
    })
  }

  const handleSetFilteredRegulatoryThemes = filteredThemes => {
    setFilteredRegulatoryThemes(filteredThemes)
    debouncedSearchLayers({
      ampTypes: filteredAmpTypes,
      extent: currentMapExtentTracker,
      geofilter: filterSearchOnMapExtent,
      regulatoryThemes: filteredThemes,
      searchedText: globalSearchText
    })
  }

  const handleResetFilters = () => {
    setFilteredRegulatoryThemes([])
    setFilteredAmpTypes([])
    debouncedSearchLayers({
      ampTypes: [],
      extent: currentMapExtentTracker,
      geofilter: filterSearchOnMapExtent,
      regulatoryThemes: [],
      searchedText: globalSearchText
    })
  }

  const toggleFilterSearchOnMapExtent = () => {
    if (filterSearchOnMapExtent) {
      setShouldReloadSearchOnExtent(false)
      dispatch(resetSearchExtent())
      setFilterSearchOnMapExtent(false)
    } else {
      setFilterSearchOnMapExtent(true)
      dispatch(setSearchExtent(currentMapExtentTracker))
      dispatch(setFitToExtent(currentMapExtentTracker))
    }
    debouncedSearchLayers({
      ampTypes: filteredAmpTypes,
      extent: currentMapExtentTracker,
      geofilter: !filterSearchOnMapExtent,
      regulatoryThemes: filteredRegulatoryThemes,
      searchedText: globalSearchText
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
      <SearchOnExtentButton
        accent={Accent.PRIMARY}
        aria-label="Définir la zone de recherche et afficher les tracés"
        className={filterSearchOnMapExtent ? '_active' : ''}
        Icon={Icon.FocusZones}
        onClick={toggleFilterSearchOnMapExtent}
        size={Size.LARGE}
        title="Définir la zone de recherche et afficher les tracés"
      />
      <ExtraButtonsWrapper
        allowResetResults={allowResetResults}
        isVisible={isVisible}
        shouldReloadSearchOnExtent={shouldReloadSearchOnExtent}
      >
        <ReloadSearch
          $active={shouldReloadSearchOnExtent}
          accent={Accent.PRIMARY}
          Icon={Icon.Search}
          onClick={handleReloadSearch}
        >
          Relancer la recherche ici
        </ReloadSearch>
        <ResetSearch
          $allowResetResults={allowResetResults}
          accent={Accent.TERTIARY}
          aria-label="Effacer les résultats de la recherche"
          Icon={Icon.Close}
          onClick={handleResetSearch}
        >
          Effacer les résultats de la recherche
        </ResetSearch>
      </ExtraButtonsWrapper>
    </>
  )
}

const Search = styled.div`
  width: 352px;
`
const ReloadSearch = styled(Button)<{ $active: boolean }>`
  display: ${p => (p.$active ? 'inline-flex' : 'none')};
  margin-right: 8px;
`
const ResetSearch = styled(Button)<{ $allowResetResults: boolean }>`
  display: ${p => (p.$allowResetResults ? 'inline-flex' : 'none')};
  background: ${p => p.theme.color.white};
`

const SearchOnExtentButton = styled(IconButton)`
  position: absolute;
  top: 0;
  left: 355px;
`
const ExtraButtonsWrapper = styled.div<{
  allowResetResults: boolean
  isVisible: boolean
  shouldReloadSearchOnExtent: boolean
}>`
  position: fixed;
  top: 15px;
  left: ${p => {
    if (p.shouldReloadSearchOnExtent || p.allowResetResults) {
      return `calc(
        50% - ((${p.shouldReloadSearchOnExtent ? '220px' : '0px'} + ${p.allowResetResults ? '285px' : '0px'}) / 2)
      )`
    }

    return '-400px'
  }}};
  width: calc(${p => `${p.shouldReloadSearchOnExtent ? '220px' : '0px'} + ${p.allowResetResults ? '285px' : '0px'}`});
`
