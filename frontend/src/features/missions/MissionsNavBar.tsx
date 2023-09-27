import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import ResponsiveNav from '@rsuite/responsive-nav'
import { useMemo } from 'react'
import { generatePath } from 'react-router-dom'
import styled from 'styled-components'

import { getMissionStatus, missionStatusLabels } from '../../domain/entities/missions'
import { sideWindowPaths } from '../../domain/entities/sideWindow'
import { deleteTab } from '../../domain/use_cases/navigation/deleteTab'
import { switchTab } from '../../domain/use_cases/navigation/switchTab'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { getMissionTitle } from '../../utils/getMissionTitle'
import { isNewMission } from '../../utils/isNewMission'

function MissionStatus({ mission }) {
  const status = getMissionStatus(mission)

  return (
    <div>
      <StyledStatus borderColor={missionStatusLabels[status].borderColor} color={missionStatusLabels[status].color} />
    </div>
  )
}

export function MissionsNavBar() {
  const {
    multiMissions: { selectedMissions },
    sideWindow: { currentPath }
  } = useAppSelector(state => state)

  const dispatch = useAppDispatch()

  const tabs = useMemo(() => {
    const missionsList = {
      icon: <Icon.Summary />,
      label: 'Liste des missions',
      nextPath: sideWindowPaths.MISSIONS
    }

    const openMissions = selectedMissions.map(selectedMission => {
      const { mission } = selectedMission
      const missionIsNewMission = isNewMission(mission?.id)

      return {
        icon: !missionIsNewMission ? <MissionStatus mission={mission} /> : undefined,
        label: <span>{getMissionTitle(missionIsNewMission, mission)}</span>,
        nextPath: generatePath(sideWindowPaths.MISSION, { id: mission.id })
      }
    })

    return [missionsList, ...openMissions]
  }, [selectedMissions])

  const selectTab = nextPath => {
    if (nextPath) {
      dispatch(switchTab(nextPath))
    }
  }

  const removeTab = nextPath => {
    if (nextPath) {
      dispatch(deleteTab(nextPath))
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <StyledResponsiveNav
        activeKey={currentPath}
        appearance="tabs"
        data-cy="missions-nav"
        moreProps={{ placement: 'bottomEnd' }}
        moreText={<IconButton accent={Accent.TERTIARY} Icon={Icon.More} />}
        onItemRemove={removeTab}
        onSelect={selectTab}
        removable
      >
        {tabs.map((item, index) => (
          <ResponsiveNav.Item
            key={item.nextPath}
            data-cy={`mission-${index}`}
            eventKey={item.nextPath}
            icon={item.icon}
          >
            {item.label}
          </ResponsiveNav.Item>
        ))}
      </StyledResponsiveNav>
    </div>
  )
}

const StyledResponsiveNav = styled(ResponsiveNav)`
  display: flex;
  box-shadow: 0px 3px 4px #7077854d;
  height: 48px;
  > .rs-nav-item {
    width: 360px;
    border-radius: 0px !important;
    color: ${p => p.theme.color.slateGray};
    font-size: 14px;
    border-right: 1px solid ${p => p.theme.color.lightGray};
    display: flex;
    align-items: center;

    &.rs-nav-item-active {
      background-color: ${p => p.theme.color.blueGray25};
      color: ${p => p.theme.color.gunMetal};
      font-weight: 500;
      border-radius: 0px;
      border: 0px !important;
      > .rs-icon {
        color: ${p => p.theme.color.slateGray} !important;
      }
    }
    > span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
    }

    > .rs-icon {
      color: ${p => p.theme.color.slateGray};
    }
    &:hover {
      border-radius: 0px !important;
      background-color: ${p => p.theme.color.blueYonder25};
    }
    &:first-child {
      > svg {
        display: none;
      }
    }
  }
  > .rs-dropdown {
    > .rs-dropdown-toggle {
      height: 100%;
      border-radius: 0px !important;
      > .rs-icon {
        display: none;
      }
    }
    > .rs-dropdown-menu {
      > .rs-dropdown-item {
        color: ${p => p.theme.color.slateGray};
        display: flex;
        flex-direction: row;
        align-items: center;
        &:hover {
          background-color: ${p => p.theme.color.blueYonder25};
        }
        &.rs-dropdown-item-active {
          background-color: ${p => p.theme.color.blueGray25};
          color: ${p => p.theme.color.gunMetal};
        }
      }
    }
  }
  > .rs-nav-bar {
    border-top: 0px;
  }
`

export const StyledStatus = styled.div<{ borderColor: string | undefined; color: string }>`
  height: 12px;
  width: 12px;
  margin-right: 5px;
  background-color: ${p => p.color};
  border-radius: 50%;
  display: flex;
  border: ${p => (p.borderColor ? `1px solid ${p.borderColor}` : '0px')};
`
