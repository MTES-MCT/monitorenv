import { Account } from '@features/Account/components/Account'
import { ControlUnitListButton } from '@features/ControlUnit/components/ControlUnitListButton'
import { DashboardMenuButton } from '@features/Dashboard/components/MenuButton'
import { dashboardActions } from '@features/Dashboard/slice'
import { InterestPointMapButton } from '@features/InterestPoint/components/InterestPointMapButton'
import { MeasurementMapButton } from '@features/map/tools/measurements/MeasurementMapButton'
import { MissionsMenu } from '@features/Mission/components/MissionsButton'
import { RecentActivityMenuButton } from '@features/RecentActivity/components/RecentActivityMenuButton'
import { ReportingsButton } from '@features/Reportings/components/ReportingsButton'
import { reduceReportingFormOnMap } from '@features/Reportings/useCases/reduceReportingFormOnMap'
import { SearchSemaphoreButton } from '@features/Semaphore/components/SearchSemaphoreButton'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { globalActions } from 'domain/shared_slices/Global'
import styled from 'styled-components'

export type MenuButtonProps = {
  onClickMenuButton: () => void
  onVisibiltyChange: (layer: string) => void
}

export function Menu() {
  const dispatch = useAppDispatch()
  const isSuperUser = useAppSelector(state => state.account.isSuperUser)
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
  const dashboardMapFocus = useAppSelector(state => state.dashboard.mapFocus)
  const layersVisibility = useAppSelector(state => state.global.layers)

  const onClickMenuButton = () => {
    dispatch(globalActions.hideAllDialogs())
    dispatch(reduceReportingFormOnMap())
  }

  const onVisibiltyChange = layer => {
    if (dashboardMapFocus) {
      dispatch(dashboardActions.setMapFocus(false))
    }
    dispatch(globalActions.setDisplayedItems({ layers: { [layer]: !layersVisibility[layer] } }))
  }

  return (
    <ButtonsWrapper $hasFullHeightRightDialogOpen={hasFullHeightRightDialogOpen} $isRightMenuOpened={isRightMenuOpened}>
      {displayMissionMenuButton && isSuperUser && (
        <li>
          <MissionsMenu onClickMenuButton={onClickMenuButton} onVisibiltyChange={onVisibiltyChange} />
        </li>
      )}
      {displayReportingsButton && isSuperUser && (
        <li>
          <ReportingsButton onClickMenuButton={onClickMenuButton} onVisibiltyChange={onVisibiltyChange} />
        </li>
      )}
      {displaySearchSemaphoreButton && (
        <li>
          <SearchSemaphoreButton onClickMenuButton={onClickMenuButton} onVisibiltyChange={onVisibiltyChange} />
        </li>
      )}
      {isRightMenuControlUnitListButtonVisible && isSuperUser && (
        <li>
          <ControlUnitListButton onClickMenuButton={onClickMenuButton} onVisibiltyChange={onVisibiltyChange} />
        </li>
      )}
      {displayRecentActivityMenuButton && (
        <li>
          <RecentActivityMenuButton onClickMenuButton={onClickMenuButton} onVisibiltyChange={onVisibiltyChange} />
        </li>
      )}
      {displayDashboard && isSuperUser && (
        <li>
          <DashboardMenuButton onClickMenuButton={onClickMenuButton} onVisibiltyChange={onVisibiltyChange} />
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
  display: flex;
  flex-direction: column;
  position: absolute;
  row-gap: 8px;
  right: ${p => (!p.$hasFullHeightRightDialogOpen || p.$isRightMenuOpened ? 10 : 0)}px;
  top: 82px;
  transition: right 0.3s ease-out;
`

const ToolWrapper = styled.li`
  margin-top: 24px;
`

const ToolButtons = styled.ul`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  padding: 0;
`
