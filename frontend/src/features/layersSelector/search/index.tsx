import Fuse from 'fuse.js'
import _ from 'lodash'
import { useState, useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { IconButton } from 'rsuite'
import styled from 'styled-components'

import { useGetAMPsQuery } from '../../../api/ampsAPI'
import { COLORS } from '../../../constants/constants'
import { setFitToExtent } from '../../../domain/shared_slices/Map'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { ReactComponent as CloseIconSVG } from '../../../uiMonitor/icons/Close.svg'
import { ReactComponent as ZoomIconSVG } from '../../../uiMonitor/icons/Focus_zones.svg'
import { ReactComponent as SearchIconSVG } from '../../../uiMonitor/icons/Search.svg'
import { getIntersectingLayerIds } from '../utils/getIntersectingLayerIds'
import { LayerFilters } from './LayerFilters'
import {
  resetSearchExtent,
  setAMPsSearchResult,
  setRegulatoryLayersSearchResult,
  setSearchExtent
} from './LayerSearch.slice'
import { ResultList } from './ResultsList'
import { SearchInput } from './SearchInput'

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

  const [filterSearchOnMapExtent, setFilterSearchOnMapExtent] = useState<boolean>(false)

  useEffect(() => {
    if (filterSearchOnMapExtent) {
      setShouldReloadSearchOnExtent(true)
    } else {
      setShouldReloadSearchOnExtent(false)
    }
  }, [filterSearchOnMapExtent, currentMapExtentTracker])

  const searchLayers = useMemo(() => {
    const fuseRegulatory = new Fuse(regulatoryLayers, {
      distance: 50,
      includeScore: false,
      keys: ['properties.layer_name', 'properties.entity_name', 'properties.ref_reg', 'properties.type'],
      threshold: 0.4
    })
    const fuseAMPs = new Fuse((amps?.entities && Object.values(amps?.entities)) || [], {
      distance: 50,
      includeScore: false,
      keys: ['name', 'designation'],
      threshold: 0.4
    })

    return async (
      searchedText: string,
      filterOnThemes: string[],
      extent: number[] | undefined,
      {
        geofilter,
        searchAmps,
        searchRegulatory
      }: { geofilter: boolean; searchAmps: boolean; searchRegulatory: boolean }
    ) => {
      if (searchAmps && (searchedText.length > 2 || geofilter)) {
        let searchedAMPS
        let itemSchema
        if (searchedText.length > 2) {
          searchedAMPS = fuseAMPs?.search<AMP>(searchedText)
          itemSchema = { bboxPath: 'item.bbox', idPath: 'item.id' }
        } else {
          searchedAMPS = amps
          itemSchema = { bboxPath: 'bbox', idPath: 'id' }
        }
        const searchedAMPsInExtent = getIntersectingLayerIds(geofilter, searchedAMPS, extent, itemSchema)
        dispatch(setAMPsSearchResult(searchedAMPsInExtent))
      } else {
        dispatch(setAMPsSearchResult([]))
      }

      if (searchRegulatory && (searchedText.length > 2 || filterOnThemes.length > 0 || geofilter)) {
        let searchedRegulatory
        let itemSchema
        if (searchedText.length > 2) {
          searchedRegulatory = fuseRegulatory.search<RegulatoryLayerType>(searchedText)
          itemSchema = { bboxPath: 'item.bbox', idPath: 'item.id' }
        } else {
          searchedRegulatory = regulatoryLayers
          itemSchema = { bboxPath: 'bbox', idPath: 'id' }
        }
        if (filterOnThemes.length > 0) {
          searchedRegulatory = searchedRegulatory.filter(layer => filterOnThemes.includes(layer.properties.thematique))
        }
        const searchedRegulatoryInExtent = getIntersectingLayerIds(geofilter, searchedRegulatory, extent, itemSchema)
        dispatch(setRegulatoryLayersSearchResult(searchedRegulatoryInExtent))
      } else {
        dispatch(setRegulatoryLayersSearchResult([]))
      }
    }
  }, [dispatch, regulatoryLayers, amps])

  const handleReloadSearch = () => {
    setShouldReloadSearchOnExtent(false)
    searchLayers(globalSearchText, filteredRegulatoryThemes, currentMapExtentTracker, {
      geofilter: filterSearchOnMapExtent,
      searchAmps: true,
      searchRegulatory: true
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
    searchLayers(searchedText, filteredRegulatoryThemes, currentMapExtentTracker, {
      geofilter: filterSearchOnMapExtent,
      searchAmps: true,
      searchRegulatory: true
    })
  }
  const handleSetFilteredRegulatoryThemes = filteredThemes => {
    setFilteredRegulatoryThemes(filteredThemes)
    searchLayers(globalSearchText, filteredThemes, currentMapExtentTracker, {
      geofilter: filterSearchOnMapExtent,
      searchAmps: true,
      searchRegulatory: true
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
    searchLayers(globalSearchText, filteredRegulatoryThemes, currentMapExtentTracker, {
      geofilter: !filterSearchOnMapExtent,
      searchAmps: true,
      searchRegulatory: true
    })
  }

  const toggleRegFilters = () => {
    setDisplayRegFilters(!displayRegFilters)
  }

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
          filteredRegulatoryThemes={filteredRegulatoryThemes}
          globalSearchText={globalSearchText}
          placeholder={regulatoryLayers.length === 0 ? 'Chargement des couches en cours' : 'Rechercher une zone reg.'}
          setGlobalSearchText={handleSearchInputChange}
          toggleRegFilters={toggleRegFilters}
        />
        {displayRegFilters && (
          <LayerFilters
            filteredRegulatoryThemes={filteredRegulatoryThemes}
            regulatoryThemes={regulatoryThemes}
            setFilteredRegulatoryThemes={handleSetFilteredRegulatoryThemes}
          />
        )}
        <ResultList searchedText={globalSearchText} />
      </Search>
      <SearchOnExtentButton
        active={filterSearchOnMapExtent}
        appearance="primary"
        data-cy="regulatory-layers-advanced-search"
        icon={<ZoomIcon className="rs-icon" />}
        onClick={toggleFilterSearchOnMapExtent}
        size="lg"
        title="Définir la zone de recherche et afficher les tracés"
      />
      <ExtraButtonsWrapper
        allowResetResults={allowResetResults}
        isVisible={isVisible}
        shouldReloadSearchOnExtent={shouldReloadSearchOnExtent}
      >
        <ReloadSearch
          $shouldReloadSearchOnExtent={shouldReloadSearchOnExtent}
          appearance="primary"
          icon={<SearchIcon className="rs-icon" />}
          onClick={handleReloadSearch}
        >
          Relancer la recherche ici
        </ReloadSearch>
        <ResetSearch
          $allowResetResults={allowResetResults}
          appearance="ghost"
          icon={<ResetIcon className="rs-icon" />}
          onClick={handleResetSearch}
        >
          Effacer les résultats de la recherche
        </ResetSearch>
      </ExtraButtonsWrapper>
    </>
  )
}

const Search = styled.div`
  width: 350px;
`
const ReloadSearch = styled(IconButton)<{ $shouldReloadSearchOnExtent: boolean }>`
  display: ${p => (p.$shouldReloadSearchOnExtent ? 'inline-block' : 'none')};
  margin-right: 8px;
`
const ResetSearch = styled(IconButton)<{ $allowResetResults: boolean }>`
  display: ${p => (p.$allowResetResults ? 'inline-block' : 'none')};
  background: ${COLORS.white};
`

const SearchIcon = styled(SearchIconSVG)`
  width: 16px;
  height: 16px;
`
const ResetIcon = styled(CloseIconSVG)`
  width: 16px;
  height: 16px;
`

const ZoomIcon = styled(ZoomIconSVG)`
  width: 24px;
  height: 22px;
`
const SearchOnExtentButton = styled(IconButton)`
  position: absolute;
  top: 0;
  left: 350px;
  margin-left: 5px;
  padding: 2px;
  flex-grow: 0;
  flex-shrink: 0;
  transition: 0.5s all;
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
