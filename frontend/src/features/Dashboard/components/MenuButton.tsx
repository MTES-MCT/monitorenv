import { DialogButton, DialogSeparator, StyledMapMenuDialogContainer } from '@components/style'
import { MenuWithCloseButton } from '@features/commonStyles/map/MenuWithCloseButton'
import { sideWindowActions } from '@features/SideWindow/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Button, Icon, MapMenuDialog, Size } from '@mtes-mct/monitor-ui'
import { sideWindowPaths } from 'domain/entities/sideWindow'
import { globalActions, setDisplayedItems } from 'domain/shared_slices/Global'
import { reduceReportingFormOnMap } from 'domain/use_cases/reporting/reduceReportingFormOnMap'
import styled from 'styled-components'

import { DrawDashboard } from './DrawDashboard'
import { dashboardActions } from '../slice'
import { closeDashboard } from '../useCases/closeDashboard'
import { resetDrawing } from '../useCases/resetDrawing'

export function DashboardMenuButton() {
  const dispatch = useAppDispatch()
  const isDashboardDialogVisible = useAppSelector(state => state.global.isDashboardDialogVisible)
  const isDrawing = useAppSelector(state => state.dashboard.isDrawing)

  const toggleDashboardDialog = e => {
    e.preventDefault()

    dispatch(globalActions.hideSideButtons())
    dispatch(
      setDisplayedItems({
        isDashboardDialogVisible: !isDashboardDialogVisible
      })
    )
    dispatch(reduceReportingFormOnMap())

    if (isDashboardDialogVisible) {
      dispatch(dashboardActions.setIsDrawing(false))
    }
  }

  const goToDashboardsList = () => dispatch(sideWindowActions.focusAndGoTo(sideWindowPaths.DASHBOARDS))

  const openDrawModal = () => {
    // TODO: delete this line, it's just to test the Weather block which needs a geometry
    dispatch(resetDrawing())
    dispatch(dashboardActions.setIsDrawing(true))
  }

  const closeModal = () => {
    dispatch(closeDashboard())
  }

  const cancel = () => {
    dispatch(resetDrawing())
    dispatch(dashboardActions.setIsDrawing(false))
  }

  return (
    <>
      {isDashboardDialogVisible && (
        <StyledMapMenuDialogContainer>
          <MapMenuDialog.Header>
            <MapMenuDialog.CloseButton Icon={Icon.Close} onClick={closeModal} />
            <StyledTitle as="h2">Briefs pour les unités</StyledTitle>
          </MapMenuDialog.Header>
          {isDrawing ? (
            <StyledDrawDashboard onCancel={cancel} />
          ) : (
            <MapMenuDialog.Footer>
              <Button Icon={Icon.Plus} isFullWidth onClick={openDrawModal}>
                Créer un tableau de bord
              </Button>
              <DialogSeparator />
              <DialogButton accent={Accent.SECONDARY} Icon={Icon.Expand} isFullWidth onClick={goToDashboardsList}>
                Voir les briefs déjà créés
              </DialogButton>
            </MapMenuDialog.Footer>
          )}
        </StyledMapMenuDialogContainer>
      )}
      <MenuWithCloseButton.ButtonOnMap
        className={isDashboardDialogVisible ? '_active' : undefined}
        data-cy="dashboard"
        Icon={Icon.Bullseye}
        onClick={toggleDashboardDialog}
        size={Size.LARGE}
        title="Voir les briefs pour les unités"
      />
    </>
  )
}

const StyledTitle = styled(MapMenuDialog.Title)`
  margin: auto;
  font-weight: normal;
`

const StyledDrawDashboard = styled(DrawDashboard)`
  margin-top: 2px;
`
