import { NavBar } from '@components/NavBar'
import { sideWindowActions } from '@features/SideWindow/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Icon, THEME } from '@mtes-mct/monitor-ui'
import ResponsiveNav from '@rsuite/responsive-nav'
import { getDashboardPageRoute } from '@utils/routes'
import { sideWindowPaths } from 'domain/entities/sideWindow'
import { useMemo, useState } from 'react'
import { generatePath } from 'react-router'

import { dashboardActions } from '../slice'
import { DashboardTab } from './DashboardTab'
import { closeTab } from '../useCases/closeTab'

export function DashboardsNavBar() {
  const dispatch = useAppDispatch()
  const dashboards = useAppSelector(state => state.dashboard.dashboards)
  const [editingTabs, setEditingTabs] = useState({})

  const handleTabEdit = (tabKey: string, isEditing: boolean) => {
    setEditingTabs(() => ({
      [tabKey]: isEditing
    }))
  }

  const tabs = useMemo(() => {
    const dashboardsList = {
      icon: <Icon.Summary />,
      isEditing: false,
      label: 'Liste des tableaux de bords',
      nextPath: sideWindowPaths.DASHBOARDS
    }

    const openDashboards = Object.entries(dashboards).map(([key, { dashboard }]) => {
      const isEditing = !!editingTabs[key]
      const tab = (
        <DashboardTab
          isEditing={isEditing}
          name={dashboard.name}
          onEdit={isEditingTab => handleTabEdit(key, isEditingTab)}
          tabKey={key}
        />
      )

      return {
        icon: <Icon.CircleFilled color={THEME.color.blueGray} size={14} />,
        isEditing,
        label: tab,
        nextPath: generatePath(sideWindowPaths.DASHBOARD, { id: key })
      }
    })

    return [dashboardsList, ...openDashboards]
  }, [dashboards, editingTabs])

  const selectDashboard = (path: string | number | undefined) => {
    if (path && typeof path === 'string') {
      if (editingTabs[path]) {
        return
      }
      dispatch(sideWindowActions.setCurrentPath(path))
      const routeParams = getDashboardPageRoute(path)
      const id = routeParams?.params.id
      dispatch(dashboardActions.setActiveDashboardId(id))
    }
  }

  const closeDashboard = path => {
    dispatch(closeTab(path))
  }

  return (
    <NavBar name="dashboards" onClose={closeDashboard} onSelect={selectDashboard}>
      {tabs.map((item, index) => (
        <ResponsiveNav.Item
          key={item.nextPath}
          as={item.isEditing ? 'div' : 'a'}
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
