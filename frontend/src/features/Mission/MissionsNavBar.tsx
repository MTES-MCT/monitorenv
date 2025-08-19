import { NavBar, TabTitle } from '@components/NavBar'
import { StyledTransparentButton } from '@components/style'
import { Accent, Icon, IconButton, Size, THEME } from '@mtes-mct/monitor-ui'
import { useMemo } from 'react'
import { generatePath } from 'react-router'
import styled from 'styled-components'

import { deleteTab } from './useCases/deleteTab'
import { switchTab } from './useCases/switchTab'
import { getMissionTitle, getNewMissionTitle, isMissionNew } from './utils'
import { getMissionStatus, missionStatusLabels } from '../../domain/entities/missions'
import { sideWindowPaths } from '../../domain/entities/sideWindow'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'

function MissionStatus({ mission }) {
  const status = getMissionStatus(mission)

  return (
    <div>
      <StyledStatus
        $borderColor={missionStatusLabels[status]?.borderColor}
        $color={missionStatusLabels[status]?.color}
      />
    </div>
  )
}

export function MissionsNavBar() {
  const dispatch = useAppDispatch()
  const selectedMissions = useAppSelector(state => state.missionForms.missions)
  const activeMissionId = useAppSelector(state => state.missionForms.activeMissionId)

  const tabs = useMemo(() => {
    const missionsList = {
      close: undefined,
      icon: <Icon.Summary />,
      isActive: !activeMissionId,
      label: 'Liste des missions',
      nextPath: sideWindowPaths.MISSIONS
    }

    const openMissions = Object.values(selectedMissions)?.map(selectedMission => {
      const { missionForm } = selectedMission
      const missionIsNewMission = isMissionNew(missionForm?.id)
      const close = nextPath => {
        if (!nextPath) {
          return
        }
        dispatch(deleteTab(nextPath))
      }

      const nextPath = generatePath(sideWindowPaths.MISSION, { id: missionForm.id })

      const title = missionIsNewMission ? getNewMissionTitle(missionForm) : getMissionTitle(missionForm)

      return {
        close: (
          <IconButton
            accent={Accent.TERTIARY}
            color={THEME.color.slateGray}
            Icon={Icon.Close}
            onClick={() => close(nextPath)}
            size={Size.SMALL}
            style={{ marginLeft: 'auto' }}
            title={`Fermer ${title}`}
          />
        ),
        icon: !missionIsNewMission ? <MissionStatus mission={missionForm} /> : undefined,
        isActive: missionForm.id === activeMissionId,
        label: <TabTitle>{title}</TabTitle>,
        nextPath
      }
    })

    return [missionsList, ...openMissions]
  }, [activeMissionId, dispatch, selectedMissions])

  const selectTab = nextPath => {
    if (!nextPath) {
      return
    }
    dispatch(switchTab(nextPath))
  }

  return (
    <NavBar name="missions" onSelect={selectTab}>
      {tabs.map((item, index) => (
        <TabWrapper key={item.nextPath} className={`rs-navbar-item ${item.isActive ? 'rs-navbar-item-active' : ''}`}>
          {item.icon}
          <Tab
            data-cy={`mission-${index}`}
            onClick={() => selectTab(item.nextPath)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                selectTab(item.nextPath)
              }
            }}
            tabIndex={item.isActive ? -1 : 0}
          >
            {item.label}
          </Tab>
          {item.close}
        </TabWrapper>
      ))}
    </NavBar>
  )
}

export const StyledStatus = styled.div<{ $borderColor: string | undefined; $color: string }>`
  height: 12px;
  width: 12px;
  margin-right: 5px;
  background-color: ${p => p.$color};
  border-radius: 50%;
  display: flex;
  border: ${p => (p.$borderColor ? `1px solid ${p.$borderColor}` : '0px')};
`

const TabWrapper = styled.div`
  display: flex;
  gap: 8px;
`

const Tab = styled(StyledTransparentButton)`
  text-align: start;
  overflow: hidden;
`
