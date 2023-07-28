import { Accent, Button, Icon } from '@mtes-mct/monitor-ui'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { hideSideButtons, setDisplayedItems, setReportingFormVisibility } from '../../../../domain/shared_slices/Global'
import { multiReportingsActions } from '../../../../domain/shared_slices/MultiReportings'
import { ReportingFormVisibility, reportingStateActions } from '../../../../domain/shared_slices/ReportingState'
import { addReporting } from '../../../../domain/use_cases/reportings/addReporting'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { MenuWithCloseButton } from '../../../commonStyles/map/MenuWithCloseButton'
import { getReportingInitialValues } from '../../../Reportings/utils'

export function SearchReportings() {
  const dispatch = useDispatch()
  const {
    global: { displayReportingsLayer },
    reportingState: { isDirty }
  } = useAppSelector(state => state)

  const closeSearchReportings = () => {
    dispatch(setDisplayedItems({ isSearchReportingsVisible: false }))
  }

  const setReportingsVisibilityOnMap = () => {
    dispatch(setDisplayedItems({ displayReportingsLayer: !displayReportingsLayer }))
  }

  const createReporting = () => {
    if (isDirty) {
      dispatch(reportingStateActions.setIsConfirmCancelDialogVisible(true))
      dispatch(multiReportingsActions.setNextSelectedReporting(getReportingInitialValues()))
    } else {
      dispatch(addReporting())
    }
    dispatch(hideSideButtons())
    dispatch(setReportingFormVisibility(ReportingFormVisibility.VISIBLE))
  }

  return (
    <MenuWithCloseButton.Container>
      <MenuWithCloseButton.Header>
        <MenuWithCloseButton.CloseButton Icon={Icon.Close} onClick={closeSearchReportings} />
        <MenuWithCloseButton.Title>Signalements</MenuWithCloseButton.Title>

        <MenuWithCloseButton.VisibilityButton
          accent={Accent.SECONDARY}
          Icon={displayReportingsLayer ? Icon.Display : Icon.Hide}
          onClick={setReportingsVisibilityOnMap}
        />
      </MenuWithCloseButton.Header>
      <StyledContainer>
        <Button Icon={Icon.Plus} onClick={createReporting}>
          Ajouter un signalement
        </Button>
      </StyledContainer>
    </MenuWithCloseButton.Container>
  )
}

const StyledContainer = styled.div`
  padding: 24px;
`
