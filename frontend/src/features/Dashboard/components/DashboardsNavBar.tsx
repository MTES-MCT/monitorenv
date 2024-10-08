import { NavBar } from '@components/NavBar'
import { sideWindowActions } from '@features/SideWindow/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Icon, TextInput, THEME } from '@mtes-mct/monitor-ui'
import ResponsiveNav from '@rsuite/responsive-nav'
import { sideWindowPaths } from 'domain/entities/sideWindow'
import { useCallback, useMemo, useState } from 'react'
import { generatePath } from 'react-router'
import styled from 'styled-components'

import { dashboardActions } from '../slice'

export function DashboardsNavBar() {
  const dispatch = useAppDispatch()

  const dashboards = useAppSelector(state => state.dashboard.dashboards)

  const [editingDashoardId, setEditingDashboardId] = useState<number | undefined>()

  const editName = (e, id: number | undefined) => {
    e.stopPropagation()
    e.preventDefault()
    setEditingDashboardId(id)
  }

  const updateDashboardName = useCallback(
    (value: string | undefined) => {
      if (!value) {
        return
      }
      dispatch(dashboardActions.setName(value))
    },
    [dispatch]
  )

  const getLabel = useCallback(
    dashboard => {
      if (editingDashoardId === dashboard.id) {
        return (
          <StyledTextInput
            isLabelHidden
            isTransparent
            label="Nom du tableau de bord"
            name="name"
            onChange={updateDashboardName}
            value={dashboard.name}
          />
        )
      }

      return (
        <Container>
          <DashboardName>{dashboard.name}</DashboardName>
          <Icon.EditUnbordered onClick={e => editName(e, dashboard.id)} />
        </Container>
      )
    },
    [editingDashoardId, updateDashboardName]
  )

  const tabs = useMemo(() => {
    const dashboardsList = {
      icon: <Icon.Summary />,
      label: 'Liste des tableaux de bords',
      nextPath: sideWindowPaths.DASHBOARDS
    }

    const openDashboards = Object.values(dashboards).map(dashboard => ({
      icon: <Icon.CircleFilled color={THEME.color.blueGray} size={14} />,
      label: getLabel(dashboard),
      nextPath: generatePath(sideWindowPaths.DASHBOARD, { id: dashboard.id })
    }))

    return [dashboardsList, ...openDashboards]
  }, [dashboards, getLabel])

  const selectDashboard = path => {
    if (editingDashoardId) {
      return
    }
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

const Container = styled.div`
  display: flex;
  width: 89%;
`
const DashboardName = styled.span`
  margin-right: 16px;
  width: 50%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
const StyledTextInput = styled(TextInput)`
  flex-grow: 1;
`
