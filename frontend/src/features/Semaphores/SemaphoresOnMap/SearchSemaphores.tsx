import { Accent, Icon, Search } from '@mtes-mct/monitor-ui'
import Fuse from 'fuse.js'
import { GeoJSON } from 'ol/format'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { useGetSemaphoresQuery } from '../../../api/semaphoresAPI'
import { OPENLAYERS_PROJECTION } from '../../../domain/entities/map/constants'
import { setDisplayedItems } from '../../../domain/shared_slices/Global'
import { setFitToExtent } from '../../../domain/shared_slices/Map'
import { addSemaphore, setSelectedSemaphore } from '../../../domain/shared_slices/SemaphoresSlice'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { MenuWithCloseButton } from '../../commonStyles/map/MenuWithCloseButton'

const FUSE_OPTIONS = {
  includeScore: true,
  keys: ['unit', 'name']
}

export function SearchSemaphores() {
  const dispatch = useDispatch()

  const { displaySemaphoresLayer } = useAppSelector(state => state.global)
  const { registeredSemaphores } = useAppSelector(state => state.semaphoresSlice)
  const { data } = useGetSemaphoresQuery()

  const [isRegisteredSemaphoresVisible, setIsRegisteredSemaphoresVisible] = useState(registeredSemaphores.length > 0)
  const [options, setOptions] = useState<any>()

  const fuse = new Fuse(data || [], FUSE_OPTIONS)

  const setSemaphoreVisibilityOnMap = () => {
    dispatch(setDisplayedItems({ displaySemaphoresLayer: !displaySemaphoresLayer, missionsMenuIsOpen: false }))
  }
  const closeSearchSemaphore = () => {
    dispatch(setDisplayedItems({ isSearchSemaphoreVisible: false }))
  }

  const handleQuerySemaphore = value => {
    setIsRegisteredSemaphoresVisible(false)
    const results = fuse.search(value).map(({ item }) => ({ label: item.unit || item.name, value: item }))
    setOptions(results)
  }

  const handleSelectSemaphore = selectedSemaphore => {
    if (selectedSemaphore) {
      dispatch(addSemaphore(selectedSemaphore))
      dispatch(setSelectedSemaphore(selectedSemaphore.id))
      zoomOnSempahore(selectedSemaphore.geom)
    }
  }

  const selectRegiteredSemaphore = selectedRegisteredSemaphore => {
    setIsRegisteredSemaphoresVisible(false)
    dispatch(setSelectedSemaphore(selectedRegisteredSemaphore.id))
    zoomOnSempahore(selectedRegisteredSemaphore.geom)
  }

  const zoomOnSempahore = geom => {
    const feature = new GeoJSON({
      featureProjection: OPENLAYERS_PROJECTION
    }).readFeature(geom)

    const extent = feature?.getGeometry()?.getExtent()
    dispatch(setFitToExtent(extent))
  }

  return (
    <MenuWithCloseButton.Container>
      <MenuWithCloseButton.Header>
        <MenuWithCloseButton.CloseButton Icon={Icon.Close} onClick={closeSearchSemaphore} />
        <MenuWithCloseButton.Title>Sémaphores</MenuWithCloseButton.Title>

        <MenuWithCloseButton.VisibilityButton
          accent={Accent.SECONDARY}
          Icon={displaySemaphoresLayer ? Icon.Display : Icon.Hide}
          onClick={setSemaphoreVisibilityOnMap}
        />
      </MenuWithCloseButton.Header>

      <StyledSearchContainer>
        <Search
          isLabelHidden
          isLight
          label="Rechercher un sémaphore"
          name="search-semaphore"
          onChange={handleSelectSemaphore}
          onQuery={handleQuerySemaphore}
          options={options}
          optionValueKey={'name' as any}
          placeholder="Rechercher un sémaphore"
        />

        {isRegisteredSemaphoresVisible && (
          <StyledRegisteredSemaphoreList>
            <StyledHistoricTitle>Historique de recherche</StyledHistoricTitle>
            {registeredSemaphores.map(semaphore => (
              <StyledRegisteredSemaphore key={semaphore.id} onClick={() => selectRegiteredSemaphore(semaphore)}>
                {semaphore.unit || semaphore.name}
              </StyledRegisteredSemaphore>
            ))}
          </StyledRegisteredSemaphoreList>
        )}
      </StyledSearchContainer>
    </MenuWithCloseButton.Container>
  )
}

const StyledRegisteredSemaphoreList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 16px;
`

const StyledHistoricTitle = styled.span`
  color: ${p => p.theme.color.slateGray};
  padding: 16px 16px 0px 16px;
  font-size: 11px;
`

const StyledRegisteredSemaphore = styled.button`
  background-color: ${p => p.theme.color.white};
  color: ${p => p.theme.color.gunMetal};
  font: normal normal medium 13px/18px Marianne;
  padding-left: 16px;
  padding-right: 16px;
  text-align: initial;
  width: 100%;

  &:last-child {
    padding-bottom: 16px;
  }
`
const StyledSearchContainer = styled.div`
  box-shadow: 0px 3px 6px ${p => p.theme.color.slateGray};
`
