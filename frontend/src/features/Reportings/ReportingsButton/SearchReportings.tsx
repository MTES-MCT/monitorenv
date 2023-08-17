import { Accent, Button, Icon, MapMenuModal } from '@mtes-mct/monitor-ui'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { sideWindowPaths } from '../../../domain/entities/sideWindow'
import { setDisplayedItems } from '../../../domain/shared_slices/Global'
import { createAndOpenNewReporting } from '../../../domain/use_cases/reportings/createAndOpenNewReporting'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { sideWindowActions } from '../../SideWindow/slice'
import { ReportingFilterContext, ReportingsFilters } from '../Filters'

export function SearchReportings() {
  const dispatch = useDispatch()
  const {
    global: { displayReportingsLayer }
  } = useAppSelector(state => state)

  const closeSearchReportings = () => {
    dispatch(setDisplayedItems({ isSearchReportingsVisible: false }))
  }

  const setReportingsVisibilityOnMap = () => {
    dispatch(setDisplayedItems({ displayReportingsLayer: !displayReportingsLayer }))
  }

  const createReporting = () => {
    dispatch(createAndOpenNewReporting())
  }

  const toggleReportingsWindow = () => {
    dispatch(sideWindowActions.focusAndGoTo(sideWindowPaths.REPORTINGS))
  }

  return (
    <StyledContainer>
      <MapMenuModal.Container>
        <MapMenuModal.Header>
          <MapMenuModal.CloseButton Icon={Icon.Close} onClick={closeSearchReportings} />
          <MapMenuModal.Title>Signalements</MapMenuModal.Title>
          <MapMenuModal.VisibilityButton
            accent={Accent.SECONDARY}
            Icon={displayReportingsLayer ? Icon.Display : Icon.Hide}
            onClick={setReportingsVisibilityOnMap}
          />
        </MapMenuModal.Header>
        <MapMenuModal.Body>
          <ReportingsFilters context={ReportingFilterContext.MAP} />
        </MapMenuModal.Body>
        <MapMenuModal.Footer>
          <Button Icon={Icon.Plus} isFullWidth onClick={createReporting}>
            Ajouter un signalement
          </Button>
          <Button accent={Accent.SECONDARY} Icon={Icon.Expand} isFullWidth onClick={toggleReportingsWindow}>
            Voir la vue détaillée des signalements
          </Button>
        </MapMenuModal.Footer>
      </MapMenuModal.Container>
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  display: flex;
`
