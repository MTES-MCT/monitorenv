import Fuse from 'fuse.js'
import _ from 'lodash'
import { useState, useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { IconButton } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'
import { setFitToExtent } from '../../../domain/shared_slices/Map'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { ReactComponent as CloseIconSVG } from '../../../uiMonitor/icons/Close.svg'
import { ReactComponent as ZoomIconSVG } from '../../../uiMonitor/icons/Focus_zones.svg'
import { ReactComponent as SearchIconSVG } from '../../../uiMonitor/icons/Search.svg'
import { RegulatoryLayerFilters } from './LayerFilters'
import { resetSearchExtent, setRegulatoryLayersSearchResult, setSearchExtent } from './LayerSearch.slice'
import { ResultList } from './ResultList'
import { SearchInput } from './SearchInput'
import { getIntersectingLayerIds } from './utils/getIntersectingLayerIds'

import type { RegulatoryLayerType } from '../../../types'

export function RegulatoryLayerSearch({ isVisible }) {
  const dispatch = useDispatch()
  const { regulatoryLayers } = useAppSelector(state => state.regulatory)
  const { regulatoryLayersSearchResult: results } = useAppSelector(state => state.regulatoryLayerSearch)
  const { currentMapExtentTracker } = useAppSelector(state => state.map)

  const [filterSearchOnMapExtent, setFilterSearchOnMapExtent] = useState(false)
  const [shouldReloadSearchOnExtent, setShouldReloadSearchOnExtent] = useState(false)
  const [globalSearchText, setGlobalSearchText] = useState('')
  const [displayRegFilters, setDisplayRegFilters] = useState(false)
  const [filteredRegulatoryThemes, setFilteredRegulatoryThemes] = useState([])

  useEffect(() => {
    if (filterSearchOnMapExtent) {
      setShouldReloadSearchOnExtent(true)
    } else {
      setShouldReloadSearchOnExtent(false)
    }
  }, [filterSearchOnMapExtent, currentMapExtentTracker])

  const searchLayers = useMemo(() => {
    const fuse = new Fuse(regulatoryLayers, {
      distance: 50,
      includeScore: false,
      keys: ['properties.layer_name', 'properties.entity_name', 'properties.ref_reg', 'properties.type'],
      threshold: 0.4
    })

    return async (searchedText, geofilter, extent, filterOnThemes) => {
      if (searchedText || filterOnThemes.length > 0) {
        const allResults = fuse.search<RegulatoryLayerType>(searchedText)
        if (extent && geofilter) {
          const filteredResults = getIntersectingLayerIds(allResults, extent, {
            bboxPath: 'item.bbox',
            idPath: 'item.id'
          })
          dispatch(setRegulatoryLayersSearchResult(filteredResults))
        } else {
          dispatch(setRegulatoryLayersSearchResult(allResults.map(layer => layer.item.id)))
        }
      } else if (extent && geofilter) {
        const filteredResults = getIntersectingLayerIds(regulatoryLayers, extent)
        dispatch(setRegulatoryLayersSearchResult(filteredResults))
      } else {
        dispatch(setRegulatoryLayersSearchResult([]))
      }
    }
  }, [dispatch, regulatoryLayers])

  const handleReloadSearch = () => {
    setShouldReloadSearchOnExtent(false)
    searchLayers(globalSearchText, filterSearchOnMapExtent, currentMapExtentTracker, filteredRegulatoryThemes)
    dispatch(setSearchExtent(currentMapExtentTracker))
    dispatch(setFitToExtent(currentMapExtentTracker))
  }
  const handleResetSearch = () => {
    dispatch(setRegulatoryLayersSearchResult([]))
    setShouldReloadSearchOnExtent(false)
    setFilterSearchOnMapExtent(false)
    setGlobalSearchText('')
    setFilteredRegulatoryThemes([])
    dispatch(resetSearchExtent())
  }

  const handleSearchInputChange = searchedText => {
    setGlobalSearchText(searchedText)
    searchLayers(searchedText, filterSearchOnMapExtent, currentMapExtentTracker, filteredRegulatoryThemes)
  }
  const handleSetFilteredRegulatoryThemes = filteredThemes => {
    setFilteredRegulatoryThemes(filteredThemes)
    searchLayers(globalSearchText, filterSearchOnMapExtent, currentMapExtentTracker, filteredThemes)
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
    searchLayers(globalSearchText, !filterSearchOnMapExtent, currentMapExtentTracker, filteredRegulatoryThemes)
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
  const allowResetResults = !_.isEmpty(results)

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
          <RegulatoryLayerFilters
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
