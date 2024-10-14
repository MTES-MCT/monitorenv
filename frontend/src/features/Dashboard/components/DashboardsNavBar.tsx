import { NavBar } from '@components/NavBar'
import { sideWindowActions } from '@features/SideWindow/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useEscapeKey } from '@hooks/useEscapeKey'
import { Icon, TextInput, THEME, useClickOutsideEffect, useNewWindow } from '@mtes-mct/monitor-ui'
import ResponsiveNav from '@rsuite/responsive-nav'
import { getDashboardPageRoute } from '@utils/routes'
import { sideWindowPaths } from 'domain/entities/sideWindow'
import { useCallback, useMemo, useRef, useState } from 'react'
import { generatePath } from 'react-router'
import styled from 'styled-components'

import { dashboardActions } from '../slice'
import { closeTab } from '../useCases/closeTab'

export function DashboardsNavBar() {
  const dispatch = useAppDispatch()
  const dashboards = useAppSelector(state => state.dashboard.dashboards)

  const ref = useRef<HTMLDivElement>(null)
  const { newWindowContainerRef } = useNewWindow()

  const [editingDashoardId, setEditingDashboardId] = useState<number | undefined>()
  const [updatedName, setUpdatedName] = useState<string | undefined>()

  const validateName = () => {
    if (updatedName) {
      dispatch(dashboardActions.setName(updatedName))
      setUpdatedName(undefined)
      setEditingDashboardId(undefined)
    }
  }

  useClickOutsideEffect(
    ref,
    () => {
      validateName()
    },
    newWindowContainerRef.current
  )
  useEscapeKey({ onEnter: () => validateName(), ref })

  const editName = useCallback(
    (e, id: number | undefined) => {
      if (!id) {
        return
      }
      e.stopPropagation()
      e.preventDefault()
      setEditingDashboardId(id)
      setUpdatedName(dashboards[id]?.name)
    },
    [dashboards]
  )

  const getLabel = useCallback(
    dashboard => {
      if (editingDashoardId === dashboard.id) {
        return (
          <StyledTextInput
            inputRef={ref}
            isLabelHidden
            isTransparent
            label="Nom du tableau de bord"
            name="name"
            onChange={value => setUpdatedName(value)}
            value={updatedName}
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
    [editName, editingDashoardId, updatedName]
  )

  const tabs = useMemo(() => {
    const dashboardsList = {
      icon: <Icon.Summary />,
      isEditing: false,
      label: 'Liste des tableaux de bords',
      nextPath: sideWindowPaths.DASHBOARDS
    }

    const openDashboards = Object.values(dashboards).map(dashboard => ({
      icon: <Icon.CircleFilled color={THEME.color.blueGray} size={14} />,
      isEditing: dashboard.id === editingDashoardId,
      label: getLabel(dashboard),
      nextPath: generatePath(sideWindowPaths.DASHBOARD, { id: dashboard.id })
    }))

    return [dashboardsList, ...openDashboards]
  }, [dashboards, getLabel, editingDashoardId])

  const selectDashboard = (path: string | number | undefined) => {
    if (editingDashoardId) {
      return
    }
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
