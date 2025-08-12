import { NavBar } from '@components/NavBar'
import { TransparentButton } from '@components/style'
import { EditTabName } from '@features/Dashboard/components/EditTabName'
import { sideWindowActions } from '@features/SideWindow/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton, Size, THEME } from '@mtes-mct/monitor-ui'
import { getDashboardPageRoute } from '@utils/routes'
import { sideWindowPaths } from 'domain/entities/sideWindow'
import React, { useMemo } from 'react'
import { generatePath } from 'react-router'
import styled from 'styled-components'

import { dashboardActions, getActiveDashboardId } from '../slice'
import { DashboardTab } from './DashboardTab'
import { closeTab } from '../useCases/closeTab'

export function DashboardsNavBar() {
  const dispatch = useAppDispatch()
  const dashboards = useAppSelector(state => state.dashboard.dashboards)
  const activeDashboardId = useAppSelector(state => getActiveDashboardId(state.dashboard))

  const tabs = useMemo(() => {
    const dashboardsList = {
      close: undefined,
      edit: undefined,
      icon: <Icon.Summary />,
      isActive: !activeDashboardId,
      isEditing: false,
      label: <span>Liste des tableaux de bords</span>,
      name: undefined,
      nextPath: sideWindowPaths.DASHBOARDS
    }

    const openDashboards = Object.entries(dashboards).map(([key, { dashboard, isEditingTabName }]) => {
      const nextPath = generatePath(sideWindowPaths.DASHBOARD, { id: key })
      const closeDashboard = (path: string, e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        dispatch(closeTab(path))
      }

      const tab = <DashboardTab name={dashboard.name} tabKey={key} />
      const controls = <EditTabName tabKey={key} />

      return {
        close: closeDashboard,
        edit: controls,
        icon: <Icon.CircleFilled color={THEME.color.blueGray} size={14} />,
        isActive: activeDashboardId === key,
        isEditing: isEditingTabName,
        label: tab,
        name: dashboard.name,
        nextPath
      }
    })

    return [dashboardsList, ...openDashboards]
  }, [activeDashboardId, dashboards, dispatch])

  const selectDashboard = (path: string | number | undefined) => {
    if (path && typeof path === 'string') {
      dispatch(sideWindowActions.setCurrentPath(path))
      const routeParams = getDashboardPageRoute(path)
      const id = routeParams?.params.id
      dispatch(dashboardActions.setActiveDashboardId(id))
      dispatch(dashboardActions.setMapFocus(false))
    }
  }

  return (
    <NavBar name="dashboards" onSelect={selectDashboard}>
      {tabs.map((item, index) => (
        <TabWrapper key={item.nextPath} className={`rs-navbar-item ${item.isActive ? 'rs-navbar-item-active' : ''}`}>
          {item.icon}
          <Tab
            data-cy={`dashboard-${index}`}
            onClick={() => selectDashboard(item.nextPath)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                selectDashboard(item.nextPath)
              }
            }}
            tabIndex={item.isActive ? -1 : 0}
          >
            {item.label}
          </Tab>

          {(item.edit || item.close) && (
            <>
              {!item.isEditing && item.edit}
              {item.close && (
                <IconButton
                  accent={Accent.TERTIARY}
                  color={THEME.color.slateGray}
                  Icon={Icon.Close}
                  onClick={e => item.close(item.nextPath, e)}
                  size={Size.SMALL}
                  title={`Fermer ${item.name}`}
                />
              )}
            </>
          )}
        </TabWrapper>
      ))}
    </NavBar>
  )
}

const TabWrapper = styled.div`
  display: flex;
  position: relative;
`

const Tab = styled(TransparentButton)`
  text-align: start;
`
