import { Accent, Button, Icon } from '@mtes-mct/monitor-ui'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { hideSideButtons, setDisplayedItems, setReportingFormVisibility } from '../../../../domain/shared_slices/Global'
import { ReportingFormVisibility, reportingStateActions } from '../../../../domain/shared_slices/ReportingState'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { MenuWithCloseButton } from '../../../commonStyles/map/MenuWithCloseButton'

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
    } else {
      // TODO pré-remplir le formulaire avec l'info du sémaphore
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
