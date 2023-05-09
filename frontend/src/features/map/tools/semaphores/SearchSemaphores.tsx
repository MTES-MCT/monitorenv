import { Search } from '@mtes-mct/monitor-ui'
import { useDispatch } from 'react-redux'
import { IconButton } from 'rsuite'
import styled from 'styled-components'

import { setDisplayedItems } from '../../../../domain/shared_slices/Global'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { ReactComponent as CloseSVG } from '../../../../uiMonitor/icons/Close.svg'
import { ReactComponent as DisplaySVG } from '../../../../uiMonitor/icons/Display.svg'
import { ReactComponent as HideSVG } from '../../../../uiMonitor/icons/Hide.svg'

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
    <StyledContainer>
      <StyledHeader>
        <StyledCloseButton icon={<CloseSVG />} onClick={closeSearchSemaphore} size="md" />
        <Title>Sémaphores</Title>

        <StyledSemaphoreVisibilityButton
          icon={displaySemaphoresLayer ? <DisplaySVG /> : <HideSVG />}
          onClick={toggleMissionsLayer}
          size="md"
        />
      </StyledHeader>
      <StyledSearchContainer>
        <Search
          isLabelHidden
          isLight
          label="Rechercher un sémaphore"
          name="search-semaphore"
          placeholder="Rechercher un sémaphore"
        />
      </StyledSearchContainer>
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  width: 319px;
  margin-right: 6px;
  background-color: ${p => p.theme.color.white};
  box-shadow: 0px 3px 6px ${p => p.theme.color.slateGray};
`
const StyledHeader = styled.div`
  height: 42px;
  background-color: ${p => p.theme.color.charcoal};
  display: flex;
  justify-content: space-between;
  padding-right: 10px;
  padding-left: 10px;
  align-items: center;
`
const Title = styled.span`
  font-size: 16px;
  line-height: 22px;
  color: ${p => p.theme.color.white};
`

const StyledSemaphoreVisibilityButton = styled(IconButton)`
  background: ${p => p.theme.color.white};
`
const StyledCloseButton = styled(IconButton)`
  color: white;
`
const StyledSearchContainer = styled.div``
