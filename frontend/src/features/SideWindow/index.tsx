import { Accent, Icon, IconButton, SideMenu } from '@mtes-mct/monitor-ui'
import ResponsiveNav from '@rsuite/responsive-nav'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { generatePath } from 'react-router'
import { ToastContainer } from 'react-toastify'

import { ErrorBoundary } from '../../components/ErrorBoundary'
import { getMissionStatus, missionStatusLabels } from '../../domain/entities/missions'
import { sideWindowPaths } from '../../domain/entities/sideWindow'
import { deleteTab } from '../../domain/use_cases/navigation/deleteTab'
import { switchTab } from '../../domain/use_cases/navigation/switchTab'
import { useAppSelector } from '../../hooks/useAppSelector'
import { NewWindowContext } from '../../ui/NewWindow'
import { getMissionTitle } from '../../utils/getMissionTitle'
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

    const openMissions = multiMissionsState.map(mission => ({
      eventKey:
        mission.type === 'edit'
          ? generatePath(sideWindowPaths.MISSION, { id: mission.mission.id })
          : generatePath(sideWindowPaths.MISSION_NEW, { id: mission.mission.id }),
      icon: mission.type === 'edit' ? <MissionStatus mission={mission.mission} /> : undefined,
      label: <span>{getMissionTitle(mission.type === 'new', mission.mission)}</span>
    }))

    return [missionsList, ...openMissions]
  }, [multiMissionsState])
  const dispatch = useDispatch()

  const selectTab = eventKey => {
    if (eventKey) {
      dispatch(switchTab(eventKey))
    }
  }

  const removeTab = eventKey => {
    if (eventKey) {
      dispatch(deleteTab(eventKey))
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
                onClick={() => selectTab(generatePath(sideWindowPaths.MISSIONS))}
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
                  onItemRemove={removeTab}
                  onSelect={selectTab}
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
