import { vigilanceAreaActions } from '@features/VigilanceArea/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Button, Icon, IconButton, Size } from '@mtes-mct/monitor-ui'
import { layerSidebarActions } from 'domain/shared_slices/LayerSidebar'
import { setFitToExtent } from 'domain/shared_slices/Map'
import { closeAreaOverlay } from 'domain/use_cases/map/closeAreaOverlay'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import {
  resetSearch,
  setIsAmpSearchResultsVisible,
  setIsRegulatorySearchResultsVisible,
  setIsVigilanceAreaSearchResultsVisible,
  setSearchExtent,
  setShouldFilterSearchOnMapExtent
} from './slice'
import { closeMetadataPanel } from '../metadataPanel/slice'

type SearchOnExtentExtraButtonsProps = {
  allowResetResults: boolean
  debouncedSearchLayers: Function
}
export function SearchOnExtentExtraButtons({
  allowResetResults,
  debouncedSearchLayers
}: SearchOnExtentExtraButtonsProps) {
  const dispatch = useAppDispatch()
  const isLayersSidebarVisible = useAppSelector(state => state.global.isLayersSidebarVisible)
  const displayLayersSidebar = useAppSelector(state => state.global.displayLayersSidebar)
  const currentMapExtentTracker = useAppSelector(state => state.map.currentMapExtentTracker)
  const shouldFilterSearchOnMapExtent = useAppSelector(state => state.layerSearch.shouldFilterSearchOnMapExtent)
  const globalSearchText = useAppSelector(state => state.layerSearch.globalSearchText)
  const filteredRegulatoryThemes = useAppSelector(state => state.layerSearch.filteredRegulatoryThemes)
  const filteredAmpTypes = useAppSelector(state => state.layerSearch.filteredAmpTypes)
  const filteredVigilanceAreaPeriod = useAppSelector(state => state.layerSearch.filteredVigilanceAreaPeriod)

  const editingVigilanceAreaId = useAppSelector(state => state.vigilanceArea.editingVigilanceAreaId)

  const [shouldReloadSearchOnExtent, setShouldReloadSearchOnExtent] = useState<boolean>(false)

  const isVisible = displayLayersSidebar && isLayersSidebarVisible

  useEffect(() => {
    if (shouldFilterSearchOnMapExtent) {
      setShouldReloadSearchOnExtent(true)
    } else {
      setShouldReloadSearchOnExtent(false)
    }
  }, [shouldFilterSearchOnMapExtent, currentMapExtentTracker])

  const handleReloadSearch = () => {
    setShouldReloadSearchOnExtent(false)
    if (currentMapExtentTracker) {
      debouncedSearchLayers({
        ampTypes: filteredAmpTypes,
        extent: currentMapExtentTracker,
        regulatoryThemes: filteredRegulatoryThemes,
        searchedText: globalSearchText,
        shouldSearchByExtent: shouldFilterSearchOnMapExtent,
        vigilanceAreaPeriodFilter: filteredVigilanceAreaPeriod
      })
      dispatch(setSearchExtent(currentMapExtentTracker))
      dispatch(setFitToExtent(currentMapExtentTracker))
    }
  }

  const handleResetSearch = () => {
    setShouldReloadSearchOnExtent(false)
    dispatch(resetSearch())
    dispatch(closeMetadataPanel())
    dispatch(closeAreaOverlay())
    dispatch(layerSidebarActions.closeAllResultsList())
    dispatch(vigilanceAreaActions.setSelectedVigilanceAreaId(editingVigilanceAreaId))
  }

  const toggleFilterSearchOnMapExtent = () => {
    dispatch(setIsAmpSearchResultsVisible(!shouldFilterSearchOnMapExtent))
    dispatch(setIsRegulatorySearchResultsVisible(!shouldFilterSearchOnMapExtent))
    dispatch(setIsVigilanceAreaSearchResultsVisible(!shouldFilterSearchOnMapExtent))
    if (shouldFilterSearchOnMapExtent) {
      dispatch(setShouldFilterSearchOnMapExtent(false))
      handleResetSearch()
    } else if (currentMapExtentTracker) {
      dispatch(setShouldFilterSearchOnMapExtent(true))
      dispatch(setSearchExtent(currentMapExtentTracker))
      dispatch(setFitToExtent(currentMapExtentTracker))
    }

    debouncedSearchLayers({
      ampTypes: filteredAmpTypes,
      extent: currentMapExtentTracker,
      regulatoryThemes: filteredRegulatoryThemes,
      searchedText: globalSearchText,
      shouldSearchByExtent: !shouldFilterSearchOnMapExtent,
      vigilanceAreaPeriodFilter: filteredVigilanceAreaPeriod
    })
  }

  return (
    <>
      <SearchOnExtentButton
        accent={Accent.PRIMARY}
        aria-label="Définir la zone de recherche et afficher les tracés"
        className={shouldFilterSearchOnMapExtent ? '_active' : ''}
        Icon={Icon.FocusZones}
        onClick={toggleFilterSearchOnMapExtent}
        size={Size.LARGE}
        title="Définir la zone de recherche et afficher les tracés"
      />
      <ExtraButtonsWrapper
        $allowResetResults={allowResetResults}
        $isVisible={isVisible}
        $shouldReloadSearchOnExtent={shouldReloadSearchOnExtent}
      >
        <ReloadSearch
          $isActive={shouldReloadSearchOnExtent}
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

const SearchOnExtentButton = styled(IconButton)`
  position: absolute;
  top: 0;
  left: 355px;
`

const ReloadSearch = styled(Button)<{ $isActive: boolean }>`
  display: ${p => (p.$isActive ? 'inline-flex' : 'none')};
  margin-right: 8px;
`
const ResetSearch = styled(Button)<{ $allowResetResults: boolean }>`
  display: ${p => (p.$allowResetResults ? 'inline-flex' : 'none')};
  background: ${p => p.theme.color.white};
`

const ExtraButtonsWrapper = styled.div<{
  $allowResetResults: boolean
  $isVisible: boolean
  $shouldReloadSearchOnExtent: boolean
}>`
  display: ${p => (p.$isVisible ? 'flex' : 'none')};
  position: fixed;
  top: 15px;
  left: ${p => {
    if (p.$shouldReloadSearchOnExtent || p.$allowResetResults) {
      return `calc(
        50% - ((${p.$shouldReloadSearchOnExtent ? '220px' : '0px'} + ${p.$allowResetResults ? '285px' : '0px'}) / 2)
      )`
    }

    return '-400px'
  }}};
`
