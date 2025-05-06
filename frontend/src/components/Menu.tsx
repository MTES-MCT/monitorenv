import { Account } from '@features/Account/components/Account'
import { ControlUnitListButton } from '@features/ControlUnit/components/ControlUnitListButton'
import { DashboardMenuButton } from '@features/Dashboard/components/MenuButton'
import { InterestPointMapButton } from '@features/InterestPoint/components/InterestPointMapButton'
import { MeasurementMapButton } from '@features/map/tools/measurements/MeasurementMapButton'
import { MissionsMenu } from '@features/Mission/components/MissionsButton'
import { RecentActivityMenuButton } from '@features/RecentActivity/components/RecentActivityMenuButton'
import { ReportingsButton } from '@features/Reportings/components/ReportingsButton'
import { SearchSemaphoreButton } from '@features/Semaphore/components/SearchSemaphoreButton'
import { useAppSelector } from '@hooks/useAppSelector'
import styled from 'styled-components'

type MenuProps = {
  isSuperUser: boolean
}

export function Menu({ isSuperUser }: MenuProps) {
  const displaySearchSemaphoreButton = useAppSelector(state => state.global.menus.displaySearchSemaphoreButton)
  const displayInterestPoint = useAppSelector(state => state.global.menus.displayInterestPoint)
  const displayMeasurement = useAppSelector(state => state.global.menus.displayMeasurement)
  const displayMissionMenuButton = useAppSelector(state => state.global.menus.displayMissionMenuButton)
  const displayReportingsButton = useAppSelector(state => state.global.menus.displayReportingsButton)
  const displayAccountButton = useAppSelector(state => state.global.menus.displayAccountButton)
  const displayDashboard = useAppSelector(state => state.global.menus.displayDashboard)
  const displayRecentActivityMenuButton = useAppSelector(state => state.global.menus.displayRecentActivityMenuButton)
  const isRightMenuControlUnitListButtonVisible = useAppSelector(
    state => state.global.menus.displayRightMenuControlUnitListButton
  )
  const hasFullHeightRightDialogOpen = useAppSelector(state => state.mainWindow.hasFullHeightRightDialogOpen)
  const isRightMenuOpened = useAppSelector(state => state.mainWindow.isRightMenuOpened)

  return (
    <ButtonsWrapper $hasFullHeightRightDialogOpen={hasFullHeightRightDialogOpen} $isRightMenuOpened={isRightMenuOpened}>
      {displayMissionMenuButton && isSuperUser && (
        <li>
          <MissionsMenu />
        </li>
      )}
      {displayReportingsButton && isSuperUser && (
        <li>
          <ReportingsButton />
        </li>
      )}
      {displaySearchSemaphoreButton && (
        <li>
          <SearchSemaphoreButton />
        </li>
      )}
      {isRightMenuControlUnitListButtonVisible && isSuperUser && (
        <li>
          <ControlUnitListButton />
        </li>
      )}
      {displayRecentActivityMenuButton && isSuperUser && (
        <li>
          <RecentActivityMenuButton />
        </li>
      )}
      {displayDashboard && isSuperUser && (
        <li>
          <DashboardMenuButton />
        </li>
      )}
      <ToolWrapper>
        <ToolButtons>
          {displayMeasurement && isSuperUser && <MeasurementMapButton />}
          {displayInterestPoint && isSuperUser && (
            <li>
              <InterestPointMapButton />
            </li>
          )}
          {displayAccountButton && (
            <li>
              <Account />
            </li>
          )}
        </ToolButtons>
      </ToolWrapper>
    </ButtonsWrapper>
  )
}

const ButtonsWrapper = styled.menu<{
  $hasFullHeightRightDialogOpen: boolean
  $isRightMenuOpened: boolean
}>`
  position: absolute;
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  top: 82px;
  right: ${p => (!p.$hasFullHeightRightDialogOpen || p.$isRightMenuOpened ? 10 : 0)}px;
  transition: right 0.3s ease-out;
  list-style: none;
`

const ToolWrapper = styled.li`
  margin-top: 24px;
`

const ToolButtons = styled.ul`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  list-style: none;
  padding: 0;
`
