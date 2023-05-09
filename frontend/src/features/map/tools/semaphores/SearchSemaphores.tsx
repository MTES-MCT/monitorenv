import { Accent, Icon, Search } from '@mtes-mct/monitor-ui'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { setDisplayedItems } from '../../../../domain/shared_slices/Global'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { MenuWithCloseButton } from '../../../commonStyles/map/MenuWithCloseButton'

export function SearchSemaphores() {
  const dispatch = useDispatch()
  const { displaySemaphoresLayer, isSearchSemaphoreVisible } = useAppSelector(state => state.global)

  const toggleMissionsLayer = () => {
    dispatch(setDisplayedItems({ displaySemaphoresLayer: !displaySemaphoresLayer, missionsMenuIsOpen: false }))
  }
  const closeSearchSemaphore = () => {
    dispatch(setDisplayedItems({ isSearchSemaphoreVisible: false }))
  }

  if (!isSearchSemaphoreVisible) {
    return null
  }

  return (
    <MenuWithCloseButton.Container>
      <MenuWithCloseButton.Header>
        <MenuWithCloseButton.CloseButton Icon={Icon.Close} onClick={closeSearchSemaphore} />
        <MenuWithCloseButton.Title>Sémaphores</MenuWithCloseButton.Title>

        <MenuWithCloseButton.VisibilityButton
          accent={Accent.SECONDARY}
          Icon={displaySemaphoresLayer ? Icon.Display : Icon.Hide}
          onClick={toggleMissionsLayer}
        />
      </MenuWithCloseButton.Header>
      <StyledSearchContainer>
        <Search
          isLabelHidden
          isLight
          label="Rechercher un sémaphore"
          name="search-semaphore"
          placeholder="Rechercher un sémaphore"
        />
      </StyledSearchContainer>
    </MenuWithCloseButton.Container>
  )
}

const StyledSearchContainer = styled.div``
