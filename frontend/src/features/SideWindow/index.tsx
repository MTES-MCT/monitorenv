import { Accent, Icon, IconButton, SideMenu } from '@mtes-mct/monitor-ui'
import ResponsiveNav from '@rsuite/responsive-nav'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { generatePath } from 'react-router'
import { ToastContainer } from 'react-toastify'

import { ErrorBoundary } from '../../components/ErrorBoundary'
import { getMissionStatus, missionStatusLabels } from '../../domain/entities/missions'
import { sideWindowPaths } from '../../domain/entities/sideWindow'
import { resetSelectedMission } from '../../domain/shared_slices/MissionsState'
import { deleteMissionFromMultiMissionState } from '../../domain/shared_slices/MultiMissionsState'
import { switchMission } from '../../domain/use_cases/missions/swithMission'
import { useAppSelector } from '../../hooks/useAppSelector'
import { NewWindowContext } from '../../ui/NewWindow'
import { getMissionTitle } from '../../utils/getMissionTitle'
import { editMissionPageRoute, newMissionPageRoute } from '../../utils/isEditOrNewMissionPage'
import { Mission } from '../missions/MissionForm'
import { Missions } from '../missions/MissionsList'
import { Route } from './Route'
import { StyledContainer, StyledResponsiveNav, StyledStatus, Wrapper } from './style'

import type { NewWindowContextValue } from '../../ui/NewWindow'
import type { ForwardedRef, MutableRefObject } from 'react'

function MissionStatus({ mission }) {
  const status = getMissionStatus(mission)

  return <StyledStatus color={missionStatusLabels[status].color} />
}
function SideWindowWithRef(_, ref: ForwardedRef<HTMLDivElement | null>) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const {
    multiMissionsState: { multiMissionsState },
    sideWindow: { currentPath }
  } = useAppSelector(state => state)
  const [isFirstRender, setIsFirstRender] = useState(true)

  const tabs = useMemo(() => {
    const missionsList = {
      eventKey: sideWindowPaths.MISSIONS,
      icon: <Icon.Summary size={16} />,
      label: 'Liste des missions'
    }

    const openingMissions = multiMissionsState.map(mission => ({
      eventKey:
        mission.type === 'edit'
          ? generatePath(sideWindowPaths.MISSION, { id: mission.mission.id })
          : generatePath(sideWindowPaths.MISSION_NEW, { id: mission.mission.id }),
      icon: mission.type === 'edit' ? <MissionStatus mission={mission.mission} /> : undefined,
      label: <span>{getMissionTitle(mission.type === 'new', mission.mission)}</span>
    }))

    return [missionsList, ...openingMissions]
  }, [multiMissionsState])
  const dispatch = useDispatch()

  const onSelectNavItem = eventKey => {
    if (eventKey) {
      dispatch(switchMission(eventKey))
    }
  }

  const newWindowContextProviderValue: NewWindowContextValue = useMemo(
    () => ({
      newWindowContainerRef: wrapperRef.current
        ? (wrapperRef as MutableRefObject<HTMLDivElement>)
        : { current: window.document.createElement('div') }
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isFirstRender]
  )

  useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(ref, () => wrapperRef.current)

  useEffect(() => {
    setIsFirstRender(false)
  }, [])

  return (
    <ErrorBoundary>
      <Wrapper ref={wrapperRef}>
        {!isFirstRender && (
          <NewWindowContext.Provider value={newWindowContextProviderValue}>
            <SideMenu>
              {/* TODO manage active cases when other buttons are implemented */}
              <SideMenu.Button
                Icon={Icon.MissionAction}
                isActive
                onClick={() => onSelectNavItem(generatePath(sideWindowPaths.MISSIONS))}
                title="missions"
              />
            </SideMenu>

            <StyledContainer>
              <div style={{ width: '100%' }}>
                <StyledResponsiveNav
                  activeKey={currentPath}
                  appearance="tabs"
                  moreProps={{ placement: 'bottomEnd' }}
                  moreText={<IconButton accent={Accent.TERTIARY} Icon={Icon.More} />}
                  onItemRemove={eventKey => {
                    const editRouteParams = editMissionPageRoute(eventKey as string)
                    const newRouteParams = newMissionPageRoute(eventKey as string)

                    const id = Number(editRouteParams?.params.id) || Number(newRouteParams?.params.id)
                    dispatch(deleteMissionFromMultiMissionState(id))
                    dispatch(resetSelectedMission())
                  }}
                  onSelect={onSelectNavItem}
                  removable
                >
                  {tabs.map(item => (
                    <ResponsiveNav.Item key={item.eventKey} eventKey={item.eventKey} icon={item.icon}>
                      {item.label}
                    </ResponsiveNav.Item>
                  ))}
                </StyledResponsiveNav>
              </div>
              <Route element={<Missions />} path={sideWindowPaths.MISSIONS} />
              <Route element={<Mission />} path={sideWindowPaths.MISSION} />
              <Route element={<Mission />} path={sideWindowPaths.MISSION_NEW} />
            </StyledContainer>
          </NewWindowContext.Provider>
        )}
        <ToastContainer containerId="sideWindow" enableMultiContainer />
      </Wrapper>
    </ErrorBoundary>
  )
}

export const SideWindow = forwardRef(SideWindowWithRef)
