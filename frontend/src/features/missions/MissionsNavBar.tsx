import { NavBar } from '@components/NavBar'
import { Icon } from '@mtes-mct/monitor-ui'
import ResponsiveNav from '@rsuite/responsive-nav'
import { useMemo } from 'react'
import { generatePath } from 'react-router-dom'
import styled from 'styled-components'

import { getMissionStatus, missionStatusLabels } from '../../domain/entities/missions'
import { sideWindowPaths } from '../../domain/entities/sideWindow'
import { deleteTab } from '../../domain/use_cases/missions/deleteTab'
import { switchTab } from '../../domain/use_cases/missions/switchTab'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { getMissionTitle } from '../../utils/getMissionTitle'
import { isNewMission } from '../../utils/isNewMission'

function MissionStatus({ mission }) {
  const status = getMissionStatus(mission)

  return (
    <div>
      <StyledStatus borderColor={missionStatusLabels[status]?.borderColor} color={missionStatusLabels[status]?.color} />
    </div>
  )
}

export function MissionsNavBar() {
  const selectedMissions = useAppSelector(state => state.missionForms.missions)

  const dispatch = useAppDispatch()

  const tabs = useMemo(() => {
    const missionsList = {
      icon: <Icon.Summary />,
      label: 'Liste des missions',
      nextPath: sideWindowPaths.MISSIONS
    }

    const openMissions = Object.values(selectedMissions)?.map(selectedMission => {
      const { missionForm } = selectedMission
      const missionIsNewMission = isNewMission(missionForm?.id)

      return {
        icon: !missionIsNewMission ? <MissionStatus mission={missionForm} /> : undefined,
        label: <span>{getMissionTitle(missionIsNewMission, missionForm)}</span>,
        nextPath: generatePath(sideWindowPaths.MISSION, { id: missionForm.id })
      }
    })

    return [missionsList, ...openMissions]
  }, [selectedMissions])

  const selectTab = nextPath => {
    if (!nextPath) {
      return
    }
    dispatch(switchTab(nextPath))
  }

  const removeTab = nextPath => {
    if (!nextPath) {
      return
    }
    dispatch(deleteTab(nextPath))
  }

  return (
    <NavBar onClose={removeTab} onSelect={selectTab}>
      {tabs.map((item, index) => (
        <ResponsiveNav.Item key={item.nextPath} data-cy={`mission-${index}`} eventKey={item.nextPath} icon={item.icon}>
          {item.label}
        </ResponsiveNav.Item>
      ))}
    </NavBar>
  )
}

export const StyledStatus = styled.div<{ borderColor: string | undefined; color: string }>`
  height: 12px;
  width: 12px;
  margin-right: 5px;
  background-color: ${p => p.color};
  border-radius: 50%;
  display: flex;
  border: ${p => (p.borderColor ? `1px solid ${p.borderColor}` : '0px')};
`
