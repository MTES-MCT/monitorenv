import { Icon, SideMenu } from '@mtes-mct/monitor-ui'
import ResponsiveNav from '@rsuite/responsive-nav'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { generatePath, matchPath } from 'react-router'
import { ToastContainer } from 'react-toastify'
import styled from 'styled-components'

import { Route } from './Route'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { COLORS } from '../../constants/constants'
import { sideWindowPaths } from '../../domain/entities/sideWindow'
import { deleteSelectedMissionId } from '../../domain/shared_slices/MultiMissionsState'
import { switchMission } from '../../domain/use_cases/missions/swithMission'
import { onNavigateDuringEditingMission } from '../../domain/use_cases/navigation/onNavigateBetweenMapAndSideWindow'
import { useAppSelector } from '../../hooks/useAppSelector'
import { NewWindowContext } from '../../ui/NewWindow'
import { Mission } from '../missions/MissionForm'
import { Missions } from '../missions/MissionsList'

import type { NewWindowContextValue } from '../../ui/NewWindow'
import type { ForwardedRef, MutableRefObject } from 'react'

function SideWindowWithRef(_, ref: ForwardedRef<HTMLDivElement | null>) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const {
    multiMissionsState: { selectedMissionsIds },
    sideWindow: { currentPath }
  } = useAppSelector(state => state)
  const [isFirstRender, setIsFirstRender] = useState(true)

  /*   console.log('multiMissionsState', multiMissionsState)
  console.log(' missionState, selectedMissionId', missionState, selectedMissionId) */

  const tabs = useMemo(() => {
    const missionsList = {
      eventKey: sideWindowPaths.MISSIONS,
      icon: <Icon.Summary size={16} />,
      label: 'Liste des missions'
    }

    const openingMissions = selectedMissionsIds.map(mission => ({
      eventKey:
        mission.type === 'edit'
          ? generatePath(sideWindowPaths.MISSION, { id: mission.id })
          : generatePath(sideWindowPaths.MISSION_NEW, { id: mission.id }),
      icon: undefined,
      label: mission.type === 'edit' ? `Mission ${mission.id}` : 'Nouvelle mission'
    }))

    return [missionsList, ...openingMissions]
  }, [selectedMissionsIds])

  const dispatch = useDispatch()

  const onSelectNavItem = async eventKey => {
    await dispatch(switchMission(eventKey))
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
                onClick={() => dispatch(onNavigateDuringEditingMission(generatePath(sideWindowPaths.MISSIONS)))}
                title="missions"
              />
            </SideMenu>

            <StyledContainer>
              <StyledResponsiveNav
                activeKey={currentPath}
                appearance="tabs"
                moreProps={{ noCaret: true }}
                moreText="plus"
                onItemRemove={eventKey => {
                  const editRouteParams = matchPath<'id', string>(
                    {
                      end: true,
                      path: sideWindowPaths.MISSION
                    },
                    eventKey as string
                  )
                  const newRouteParams = matchPath<'id', string>(
                    {
                      end: true,
                      path: sideWindowPaths.MISSION_NEW
                    },
                    eventKey as string
                  )

                  const indexToRemove = selectedMissionsIds.findIndex(
                    mission =>
                      Number(editRouteParams?.params.id) === mission.id ||
                      Number(newRouteParams?.params.id) === mission.id
                  )
                  dispatch(deleteSelectedMissionId(indexToRemove))
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

const Wrapper = styled.section`
  background: ${p => p.theme.color.white};
  display: flex;
  flex: 1;
  height: 100%;
  min-height: 0;
  min-width: 0;

  @keyframes blink {
    0% {
      background: ${COLORS.background};
    }
    50% {
      background: ${COLORS.lightGray};
    }
    0% {
      background: ${COLORS.background};
    }
  }
`

const StyledContainer = styled.section`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: calc(100% - 64px);
`
const StyledResponsiveNav = styled(ResponsiveNav)`
  display: flex;
  > .rs-nav-item {

    border-radius: 0px;
    display: flex;
    justify-content: space-between;
    align-self: start;
    align-items: center;
    color: ${p => p.theme.color.slateGray}
    font-size: 14px;

    &.rs-nav-item-active {
      background-color: ${p => p.theme.color.blueGray[25]};
      color: ${p => p.theme.color.gunMetal};
      font-weight: 500;
      border-radius: 0px;
      > .rs-icon {
        color: ${p => p.theme.color.slateGray} !important;
      }
    }

    > .rs-icon {
      color: ${p => p.theme.color.slateGray};
    }
    &:hover {
      border-radius: 0px;
    }
  }

  
  
`

export const SideWindow = forwardRef(SideWindowWithRef)
