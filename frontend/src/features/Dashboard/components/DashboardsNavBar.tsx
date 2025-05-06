import { NavBar } from '@components/NavBar'
import { sideWindowActions } from '@features/SideWindow/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Icon, THEME } from '@mtes-mct/monitor-ui'
import { getDashboardPageRoute } from '@utils/routes'
import { sideWindowPaths } from 'domain/entities/sideWindow'
import { useMemo } from 'react'
import { generatePath } from 'react-router'
import { Nav } from 'rsuite'

import { dashboardActions } from '../slice'
import { DashboardTab } from './DashboardTab'
import { closeTab } from '../useCases/closeTab'

export function DashboardsNavBar() {
  const dispatch = useAppDispatch()
  const dashboards = useAppSelector(state => state.dashboard.dashboards)

  const tabs = useMemo(() => {
    const dashboardsList = {
      icon: <Icon.Summary />,
      isEditing: false,
      label: <span>Liste des tableaux de bords</span>,
      nextPath: sideWindowPaths.DASHBOARDS
    }

    const openDashboards = Object.entries(dashboards).map(([key, { dashboard, isEditingTabName }]) => {
      const nextPath = generatePath(sideWindowPaths.DASHBOARD, { id: key })
      const closeDashboard = (path, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        dispatch(closeTab(path))
      }

      const tab = <DashboardTab close={e => closeDashboard(nextPath, e)} name={dashboard.name} tabKey={key} />

      return {
        icon: <Icon.CircleFilled color={THEME.color.blueGray} size={14} />,
        isEditing: isEditingTabName,
        label: tab,
        nextPath
      }
    })

    return [dashboardsList, ...openDashboards]
  }, [dashboards, dispatch])

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
        <Nav.Item
          key={item.nextPath}
          as={item.isEditing ? 'div' : 'a'}
          data-cy={`dashboard-${index}`}
          eventKey={item.nextPath}
          icon={item.icon}
        >
          {item.label}
        </Nav.Item>
      ))}
    </NavBar>
  )
}
