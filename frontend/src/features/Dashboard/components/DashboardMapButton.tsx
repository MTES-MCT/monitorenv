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

export function DashboardMapButton() {
  const dispatch = useAppDispatch()
  const isDashboardDialogVisible = useAppSelector(state => state.global.isDashboardDialogVisible)

  const toggleDashboardDialog = e => {
    e.preventDefault()
    dispatch(globalActions.hideSideButtons())
    dispatch(
      setDisplayedItems({
        isDashboardDialogVisible: !isDashboardDialogVisible
      })
    )
    dispatch(reduceReportingFormOnMap())
  }
  const gotToDashboardsList = () => dispatch(sideWindowActions.focusAndGoTo(sideWindowPaths.DASHBOARDS))

  return (
    <>
      {isDashboardDialogVisible && (
        <StyledMapMenuDialogContainer>
          <MapMenuDialog.Header>
            <MapMenuDialog.CloseButton Icon={Icon.Close} onClick={toggleDashboardDialog} />
            <StyledTitle>Briefs pour les unités</StyledTitle>
          </MapMenuDialog.Header>
          <MapMenuDialog.Footer>
            <Button Icon={Icon.Plus} isFullWidth onClick={() => {}}>
              Créer un tableau de bord
            </Button>
            <DialogSeparator />
            <DialogButton accent={Accent.SECONDARY} Icon={Icon.Expand} isFullWidth onClick={gotToDashboardsList}>
              Voir les briefs déjà créés
            </DialogButton>
          </MapMenuDialog.Footer>
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
`
