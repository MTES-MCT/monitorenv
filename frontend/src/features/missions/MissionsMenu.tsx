import { Accent, Button, Icon, Size } from '@mtes-mct/monitor-ui'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { COLORS } from '../../constants/constants'
import { sideWindowPaths } from '../../domain/entities/sideWindow'
import { setDisplayedItems } from '../../domain/shared_slices/Global'
import { addMission } from '../../domain/use_cases/missions/addMission'
import { useAppSelector } from '../../hooks/useAppSelector'
import { MenuWithCloseButton } from '../commonStyles/map/MenuWithCloseButton'
import { sideWindowActions, SideWindowStatus } from '../SideWindow/slice'

export function MissionsMenu() {
  const dispatch = useDispatch()
  const { displayMissionsLayer, missionsMenuIsOpen } = useAppSelector(state => state.global)
  const { sideWindow } = useAppSelector(state => state)

  const toggleMissionsWindow = () => {
    dispatch(sideWindowActions.focusAndGoTo(sideWindowPaths.MISSIONS))
  }
  const toggleMissionsLayer = () => {
    dispatch(setDisplayedItems({ displayMissionsLayer: !displayMissionsLayer }))
  }
  const toggleMissionsMenu = e => {
    e.preventDefault()
    dispatch(setDisplayedItems({ isSearchSemaphoreVisible: false, missionsMenuIsOpen: !missionsMenuIsOpen }))
  }
  const handleAddNewMission = () => {
    dispatch(addMission())
  }

  return (
    <Wrapper>
      {missionsMenuIsOpen && (
        <MenuWithCloseButton.Container>
          <MenuWithCloseButton.Header>
            <MenuWithCloseButton.CloseButton Icon={Icon.Close} onClick={toggleMissionsMenu} />
            <MenuWithCloseButton.Title>Missions et contrôles</MenuWithCloseButton.Title>
            <MenuWithCloseButton.VisibilityButton
              accent={Accent.SECONDARY}
              Icon={displayMissionsLayer ? Icon.Display : Icon.Hide}
              onClick={toggleMissionsLayer}
            />
          </MenuWithCloseButton.Header>
          <MissionsMenuBody>
            <Section>
              <StyledButton Icon={Icon.Plus} isFullWidth onClick={handleAddNewMission}>
                Ajouter une nouvelle mission
              </StyledButton>
            </Section>
            <Section>
              <StyledButton accent={Accent.SECONDARY} Icon={Icon.Expand} isFullWidth onClick={toggleMissionsWindow}>
                Voir la vue détaillée des missions
              </StyledButton>
            </Section>
          </MissionsMenuBody>
        </MenuWithCloseButton.Container>
      )}
      <MenuWithCloseButton.ButtonOnMap
        className={sideWindow.status !== SideWindowStatus.CLOSED ? '_active' : undefined}
        data-cy="missions-button"
        Icon={Icon.MissionAction}
        onClick={toggleMissionsMenu}
        size={Size.LARGE}
        title="voir les missions"
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: absolute;
  top: 85px;
  right: 10px;
  display: flex;
  justify-content: flex-end;
`

const MissionsMenuBody = styled.div``
const Section = styled.div`
  padding: 12px;
  &:not(:last-child) {
    border-bottom: 1px solid ${COLORS.gainsboro};
  }
`

// TODO delete when Monitor-ui component have good padding
const StyledButton = styled(Button)`
  padding: 4px 12px;
`
