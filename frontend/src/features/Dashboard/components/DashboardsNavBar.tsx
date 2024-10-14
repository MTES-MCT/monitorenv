import { NavBar } from '@components/NavBar'
import { sideWindowActions } from '@features/SideWindow/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Icon, THEME } from '@mtes-mct/monitor-ui'
import ResponsiveNav from '@rsuite/responsive-nav'
import { getDashboardPageRoute } from '@utils/routes'
import { sideWindowPaths } from 'domain/entities/sideWindow'
import { useMemo } from 'react'
import { generatePath } from 'react-router'

import { dashboardActions } from '../slice'
import { closeTab } from '../useCases/closeTab'

export function DashboardsNavBar() {
  const dispatch = useAppDispatch()
  const dashboards = useAppSelector(state => state.dashboard.dashboards ?? [])

  const tabs = useMemo(() => {
    const dashboardsList = {
      icon: <Icon.Summary />,
      label: 'Liste des tableaux de bords',
      nextPath: sideWindowPaths.DASHBOARDS
    }

    const openDashboards = Object.values(dashboards)?.map(dashboard => ({
      icon: <Icon.CircleFilled color={THEME.color.blueGray} size={14} />,
      label: <span>Tab {dashboard.dashboard.id}</span>,
      nextPath: generatePath(sideWindowPaths.DASHBOARD, { id: dashboard.dashboard.id })
    }))

    return [dashboardsList, ...openDashboards]
  }, [dashboards])

  const selectDashboard = (path: string | number | undefined) => {
    if (path && typeof path === 'string') {
      dispatch(sideWindowActions.setCurrentPath(path))
      const routeParams = getDashboardPageRoute(path)
      const id = routeParams?.params.id
      if (id) {
        dispatch(dashboardActions.setActiveDashboardId(id))
      }
    }
  }

  const closeDashboard = path => {
    closeTab(path)
  }

  return (
    <NavBar name="dashboards" onClose={closeDashboard} onSelect={selectDashboard}>
      {tabs.map((item, index) => (
        <ResponsiveNav.Item
          key={item.nextPath}
          data-cy={`dashboard-${index}`}
          eventKey={item.nextPath}
          icon={item.icon}
        >
          {item.label}
        </ResponsiveNav.Item>
      ))}
    </NavBar>
  )
}
