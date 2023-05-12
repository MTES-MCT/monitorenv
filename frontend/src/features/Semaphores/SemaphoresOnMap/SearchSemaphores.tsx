import { Accent, Icon, Search } from '@mtes-mct/monitor-ui'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { useGooglePlacesAPI } from '../../../api/googlePlacesAPI/googlePlacesAPI'
import { setDisplayedItems } from '../../../domain/shared_slices/Global'
import { addSemaphore } from '../../../domain/shared_slices/Semaphores'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { MenuWithCloseButton } from '../../commonStyles/map/MenuWithCloseButton'

export function SearchSemaphores() {
  const dispatch = useDispatch()
  const { displaySemaphoresLayer } = useAppSelector(state => state.global)
  const { registeredSemaphores } = useAppSelector(state => state.semaphores)

  const [isRegisteredSemaphoresVisible, setIsRegisteredSemaphoresVisible] = useState(registeredSemaphores.length > 0)
  const [searchedSemaphores, setSearchedSemaphores] = useState<string | undefined>('')

  const setSemaphoreVisibilityOnMap = () => {
    dispatch(setDisplayedItems({ displaySemaphoresLayer: !displaySemaphoresLayer, missionsMenuIsOpen: false }))
  }
  const closeSearchSemaphore = () => {
    dispatch(setDisplayedItems({ isSearchSemaphoreVisible: false }))
  }

  const results = useGooglePlacesAPI(searchedSemaphores)
  const options = results.map(r => ({ label: r.label, value: r.label })) as any

  const handleQuerySemaphore = value => {
    setIsRegisteredSemaphoresVisible(false)
    setSearchedSemaphores(value)
  }
  const handleSelectSemaphore = async semaphore => {
    if (semaphore) {
      dispatch(
        addSemaphore({
          label: semaphore,
          value: semaphore
        })
      )
    }
  }

  const selectRegiteredSemaphore = () => {}

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
          placeholder="Rechercher un sémaphore"
        />

        {isRegisteredSemaphoresVisible && (
          <StyledRegisteredSemaphoreList>
            <StyledHistoricTitle>Historique de recherche</StyledHistoricTitle>
            {registeredSemaphores.map(semaphore => (
              <StyledRegisteredSemaphore onClick={selectRegiteredSemaphore}>
                {semaphore.label}
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
