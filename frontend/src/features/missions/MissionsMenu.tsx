import { useDispatch } from 'react-redux'
import { IconButton } from 'rsuite'
import styled from 'styled-components'

import { setSideWindowPath } from '../../components/SideWindowRouter/SideWindowRouter.slice'
import { COLORS } from '../../constants/constants'
import { sideWindowPaths } from '../../domain/entities/sideWindow'
import { setDisplayedItems } from '../../domain/shared_slices/Global'
import { useAppSelector } from '../../hooks/useAppSelector'
import { ReactComponent as CloseSVG } from '../../uiMonitor/icons/Close.svg'
import { ReactComponent as DisplaySVG } from '../../uiMonitor/icons/Display.svg'
import { ReactComponent as EnlargeSVG } from '../../uiMonitor/icons/Enlarge.svg'
import { ReactComponent as HideSVG } from '../../uiMonitor/icons/Hide.svg'
import { ReactComponent as MissionsSVG } from '../../uiMonitor/icons/Operations.svg'
import { ReactComponent as PlusSVG } from '../../uiMonitor/icons/Plus.svg'

export function MissionsMenu() {
  const dispatch = useDispatch()
  const { displayMissionsLayer, missionsMenuIsOpen } = useAppSelector(state => state.global)
  const { sideWindowIsOpen } = useAppSelector(state => state.sideWindowRouter)

  const toggleMissionsWindow = () => {
    dispatch(setSideWindowPath(sideWindowPaths.MISSIONS))
  }
  const toggleMissionsLayer = () => {
    dispatch(setDisplayedItems({ displayMissionsLayer: !displayMissionsLayer }))
  }
  const toggleMissionsMenu = () => {
    dispatch(setDisplayedItems({ missionsMenuIsOpen: !missionsMenuIsOpen }))
  }
  const handleAddNewMission = () => {
    dispatch(setSideWindowPath(sideWindowPaths.MISSION_NEW))
  }

  return (
    <Wrapper>
      {missionsMenuIsOpen && (
        <MissionsMenuWrapper>
          <MissionsMenuHeader>
            <ToggleMissionMenuButton icon={<CloseSVG />} onClick={toggleMissionsMenu} size="md" />
            <Title>Missions et contrôles</Title>
            <ToggleMissionsButton
              icon={displayMissionsLayer ? <DisplaySVG /> : <HideSVG />}
              onClick={toggleMissionsLayer}
              size="md"
            />
          </MissionsMenuHeader>
          <MissionsMenuBody>
            <Section>
              <BlockIconButton
                appearance="primary"
                icon={<PlusSVG className="rs-icon" />}
                onClick={handleAddNewMission}
              >
                Ajouter une nouvelle mission
              </BlockIconButton>
            </Section>
            <Section>
              <BlockIconButton
                appearance="ghost"
                icon={<EnlargeSVG className="rs-icon" />}
                onClick={toggleMissionsWindow}
              >
                Voir la vue détaillée des missions
              </BlockIconButton>
            </Section>
          </MissionsMenuBody>
        </MissionsMenuWrapper>
      )}
      <MissionButton
        active={!!sideWindowIsOpen}
        appearance="primary"
        data-cy="missions-button"
        icon={<MissionsIcon className="rs-icon" />}
        onClick={toggleMissionsMenu}
        size="lg"
        title="voir les missions"
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: absolute;
  top: 55px;
  right: 10px;
  width: 365px;
  display: flex;
  justify-content: flex-end;
`
const MissionsMenuWrapper = styled.div`
  width: 319px;
  margin-right: 6px;
  background-color: ${COLORS.white};
  box-shadow: 0px 3px 6px ${COLORS.slateGray};
`
const MissionsMenuHeader = styled.div`
  height: 40px;
  background-color: ${COLORS.charcoal};
  display: flex;
  justify-content: space-between;
  padding-right: 10px;
  padding-left: 10px;
  align-items: center;
`
const Title = styled.span`
  font-size: 16px;
  line-height: 22px;
  color: ${COLORS.white};
`
const MissionsMenuBody = styled.div``
const Section = styled.div`
  padding: 12px;
  &:not(:last-child) {
    border-bottom: 1px solid ${COLORS.gainsboro};
  }
`
const MissionButton = styled(IconButton)``
const MissionsIcon = styled(MissionsSVG)``
const ToggleMissionsButton = styled(IconButton)`
  background: ${COLORS.white};
`
const ToggleMissionMenuButton = styled(IconButton)`
  color: white;
`
const BlockIconButton = styled(IconButton)`
  width: 100%;
`
