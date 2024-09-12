import { StyledMapMenuDialogContainer } from '@components/style'
import { ReportingFilterContext, ReportingsFilters } from '@features/Reportings/Filters'
import { sideWindowActions } from '@features/SideWindow/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Button, Icon, MapMenuDialog } from '@mtes-mct/monitor-ui'
import { sideWindowPaths } from 'domain/entities/sideWindow'
import { ReportingContext, setDisplayedItems } from 'domain/shared_slices/Global'
import { closeAllOverlays } from 'domain/use_cases/map/closeAllOverlays'
import { addReporting } from 'domain/use_cases/reporting/addReporting'

export function SearchReportings() {
  const dispatch = useAppDispatch()
  const displayReportingsLayer = useAppSelector(state => state.global.displayReportingsLayer)

  const closeSearchReportings = () => {
    dispatch(setDisplayedItems({ isSearchReportingsVisible: false }))
  }

  const setReportingsVisibilityOnMap = () => {
    dispatch(setDisplayedItems({ displayReportingsLayer: !displayReportingsLayer }))
  }

  const createReporting = () => {
    dispatch(setDisplayedItems({ isSearchReportingsVisible: false }))
    dispatch(addReporting(ReportingContext.MAP))
    dispatch(closeAllOverlays())
  }

  const toggleReportingsWindow = async () => {
    dispatch(sideWindowActions.focusAndGoTo(sideWindowPaths.REPORTINGS))
  }

  return (
    <StyledMapMenuDialogContainer>
      <MapMenuDialog.Header>
        <MapMenuDialog.CloseButton Icon={Icon.Close} onClick={closeSearchReportings} />
        <MapMenuDialog.Title>Signalements</MapMenuDialog.Title>
        <MapMenuDialog.VisibilityButton
          accent={Accent.SECONDARY}
          Icon={displayReportingsLayer ? Icon.Display : Icon.Hide}
          onClick={setReportingsVisibilityOnMap}
        />
      </MapMenuDialog.Header>
      <MapMenuDialog.Body>
        <ReportingsFilters context={ReportingFilterContext.MAP} />
      </MapMenuDialog.Body>
      <MapMenuDialog.Footer>
        <Button data-cy="add-reporting" Icon={Icon.Plus} isFullWidth onClick={createReporting}>
          Ajouter un signalement
        </Button>
        <Button accent={Accent.SECONDARY} Icon={Icon.Expand} isFullWidth onClick={toggleReportingsWindow}>
          Voir la vue détaillée des signalements
        </Button>
      </MapMenuDialog.Footer>
    </StyledMapMenuDialogContainer>
  )
}
