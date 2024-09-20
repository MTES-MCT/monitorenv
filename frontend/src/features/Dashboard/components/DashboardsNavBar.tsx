import { NavBar } from '@components/NavBar'
import { sideWindowActions } from '@features/SideWindow/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Icon, THEME } from '@mtes-mct/monitor-ui'
import ResponsiveNav from '@rsuite/responsive-nav'
import { sideWindowPaths } from 'domain/entities/sideWindow'
import { useMemo } from 'react'
import { generatePath } from 'react-router'

export function DashboardsNavBar() {
  const dispatch = useAppDispatch()
  const tabs = useMemo(() => {
    const dashboardsList = {
      icon: <Icon.Summary />,
      label: 'Liste des tableaux de bords',
      nextPath: sideWindowPaths.DASHBOARDS
    }

    // TODO 19/09 : replace with real data
    const openDashboards = {
      icon: <Icon.CircleFilled color={THEME.color.blueGray} size={14} />,
      label: <span>Tab XX/XX/XX</span>,
      nextPath: generatePath(sideWindowPaths.DASHBOARD, { id: 1 })
    }

    return [dashboardsList, openDashboards]
  }, [])

  const selectDashboard = path => {
    dispatch(sideWindowActions.setCurrentPath(path))
  }

  const closeDashboard = () => {}

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
