import { Accent, Icon, IconButton, Button, Size } from '@mtes-mct/monitor-ui'
import Fuse from 'fuse.js'
import _ from 'lodash'
import { useState, useEffect, useMemo, useRef } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { LayerFilters } from './LayerFilters'
import {
  resetSearchExtent,
  setAMPsSearchResult,
  setRegulatoryLayersSearchResult,
  setSearchExtent
} from './LayerSearch.slice'
import { ResultList } from './ResultsList'
import { SearchInput } from './SearchInput'
import { useGetAMPsQuery } from '../../../api/ampsAPI'
import { setFitToExtent } from '../../../domain/shared_slices/Map'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { getIntersectingLayerIds } from '../utils/getIntersectingLayerIds'

import type { AMP } from '../../../domain/entities/AMPs'
import type { RegulatoryLayerType } from '../../../types'

export function LayerSearch({ isVisible }) {
  const dispatch = useDispatch()
  const { data: amps } = useGetAMPsQuery()
  const { regulatoryLayers } = useAppSelector(state => state.regulatory)
  const { ampsSearchResult, regulatoryLayersSearchResult } = useAppSelector(state => state.layerSearch)
  const { currentMapExtentTracker } = useAppSelector(state => state.map)

  const [shouldReloadSearchOnExtent, setShouldReloadSearchOnExtent] = useState<boolean>(false)
  const [displayRegFilters, setDisplayRegFilters] = useState<boolean>(false)

  const [globalSearchText, setGlobalSearchText] = useState<string>('')
  const [filteredRegulatoryThemes, setFilteredRegulatoryThemes] = useState<string[]>([])
  const [filteredAmpTypes, setFilteredAmpTypes] = useState<string[]>([])

  const [filterSearchOnMapExtent, setFilterSearchOnMapExtent] = useState<boolean>(false)

  const isSearchThrottled = useRef(false)

  useEffect(() => {
    if (filterSearchOnMapExtent) {
      setShouldReloadSearchOnExtent(true)
    } else {
      setShouldReloadSearchOnExtent(false)
    }
  }, [filterSearchOnMapExtent, currentMapExtentTracker])

  const searchLayers = useMemo(() => {
    const fuseRegulatory = new Fuse(regulatoryLayers, {
      ignoreLocation: true,
      includeScore: false,
      keys: ['properties.layer_name', 'properties.entity_name', 'properties.ref_reg', 'properties.type'],
      minMatchCharLength: 3,
      threshold: 0.4
    })
    const fuseAMPs = new Fuse((amps?.entities && Object.values(amps?.entities)) || [], {
      ignoreLocation: true,
      includeScore: false,
      keys: ['name', 'type'],
      minMatchCharLength: 3,
      threshold: 0.4
    })

    return async ({
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
      if (isSearchThrottled.current) {
        return
      }
      isSearchThrottled.current = true

      setTimeout(() => {
        isSearchThrottled.current = false

        if (searchedText.length > 2 || ampTypes.length > 0 || geofilter) {
          let searchedAMPS
          let itemSchema
          if (searchedText.length > 2) {
            searchedAMPS = fuseAMPs?.search<AMP>(searchedText)
            itemSchema = { bboxPath: 'item.bbox', idPath: 'item.id' }
          } else {
            searchedAMPS = amps?.entities && Object.values(amps?.entities)
            itemSchema = { bboxPath: 'bbox', idPath: 'id' }
          }
          if (ampTypes.length > 0) {
            searchedAMPS = searchedAMPS.filter(amp => ampTypes.includes(amp.type))
          }
          const searchedAMPsInExtent = getIntersectingLayerIds(geofilter, searchedAMPS, extent, itemSchema)
          dispatch(setAMPsSearchResult(searchedAMPsInExtent))
        } else {
          dispatch(setAMPsSearchResult([]))
        }

        if (searchedText.length > 2 || regulatoryThemes.length > 0 || geofilter) {
          let searchedRegulatory
          let itemSchema
          if (searchedText.length > 2) {
            searchedRegulatory = fuseRegulatory.search<RegulatoryLayerType>(searchedText)
            itemSchema = { bboxPath: 'item.bbox', idPath: 'item.id' }
          } else {
            searchedRegulatory = regulatoryLayers
            itemSchema = { bboxPath: 'bbox', idPath: 'id' }
          }
          if (regulatoryThemes.length > 0) {
            searchedRegulatory = searchedRegulatory.filter(layer =>
              regulatoryThemes.includes(layer.properties.thematique)
            )
          }
          const searchedRegulatoryInExtent = getIntersectingLayerIds(geofilter, searchedRegulatory, extent, itemSchema)
          dispatch(setRegulatoryLayersSearchResult(searchedRegulatoryInExtent))
        } else {
          dispatch(setRegulatoryLayersSearchResult([]))
        }
      }, 300)
    }
  }, [dispatch, regulatoryLayers, amps])

  const handleReloadSearch = () => {
    setShouldReloadSearchOnExtent(false)
    searchLayers({
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
    searchLayers({
      ampTypes: filteredAmpTypes,
      extent: currentMapExtentTracker,
      geofilter: filterSearchOnMapExtent,
      regulatoryThemes: filteredRegulatoryThemes,
      searchedText
    })
  }

  const handleSetFilteredAmpTypes = filteredTypes => {
    setFilteredAmpTypes(filteredTypes)
    searchLayers({
      ampTypes: filteredTypes,
      extent: currentMapExtentTracker,
      geofilter: filterSearchOnMapExtent,
      regulatoryThemes: filteredRegulatoryThemes,
      searchedText: globalSearchText
    })
  }

  const handleSetFilteredRegulatoryThemes = filteredThemes => {
    setFilteredRegulatoryThemes(filteredThemes)
    searchLayers({
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
    searchLayers({
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
    searchLayers({
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
        .value(),
    [amps]
  )
  const regulatoryThemes = useMemo(
    () =>
      _.chain(regulatoryLayers)
        .filter(l => !!l.properties.thematique)
        .map(l => l.properties.thematique.split(','))
        .flatMap()
        .map(l => l.trim())
        .uniq()
        .map(l => ({ label: l, value: l }))
        .sortBy('label')
        .value(),
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
        className={filterSearchOnMapExtent ? '_active' : ''}
        data-cy="layers-advanced-search"
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
