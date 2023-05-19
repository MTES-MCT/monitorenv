import { Accent, Icon, Search } from '@mtes-mct/monitor-ui'
import { GeoJSON } from 'ol/format'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { OPENLAYERS_PROJECTION } from '../../../domain/entities/map/constants'
import { setDisplayedItems } from '../../../domain/shared_slices/Global'
import { setFitToExtent } from '../../../domain/shared_slices/Map'
import { addSemaphore, setSelectedSemaphore } from '../../../domain/shared_slices/Semaphores'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { MenuWithCloseButton } from '../../commonStyles/map/MenuWithCloseButton'
import * as mocks from './semaphores.json'

export function SearchSemaphores() {
  const dispatch = useDispatch()
  const { displaySemaphoresLayer } = useAppSelector(state => state.global)
  const { registeredSemaphores } = useAppSelector(state => state.semaphores)

  const [isRegisteredSemaphoresVisible, setIsRegisteredSemaphoresVisible] = useState(registeredSemaphores.length > 0)
  const [searchedSemaphores, setSearchedSemaphores] = useState<string | undefined>()

  const setSemaphoreVisibilityOnMap = () => {
    dispatch(setDisplayedItems({ displaySemaphoresLayer: !displaySemaphoresLayer, missionsMenuIsOpen: false }))
  }
  const closeSearchSemaphore = () => {
    dispatch(setDisplayedItems({ isSearchSemaphoreVisible: false }))
  }

  const results = mocks.semaphores.filter(semaphore => semaphore.unite.search(searchedSemaphores || '') !== -1)
  const options = results.map(result => ({ key: result.id, label: result.unite || result.nom, value: result })) as any

  const handleQuerySemaphore = value => {
    setIsRegisteredSemaphoresVisible(false)
    setSearchedSemaphores(value)
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
          optionValueKey="unite"
          placeholder="Rechercher un sémaphore"
        />

        {isRegisteredSemaphoresVisible && (
          <StyledRegisteredSemaphoreList>
            <StyledHistoricTitle>Historique de recherche</StyledHistoricTitle>
            {registeredSemaphores.map(semaphore => (
              <StyledRegisteredSemaphore key={semaphore.id} onClick={() => selectRegiteredSemaphore(semaphore)}>
                {semaphore.unite || semaphore.nom}
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
