import { Icon, Size } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { SearchReportings } from './SearchReportings'
import { globalActions, ReportingContext, VisibilityState } from '../../../domain/shared_slices/Global'
import { reduceReportingFormOnMap } from '../../../domain/use_cases/reporting/reduceReportingFormOnMap'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { MenuWithCloseButton } from '../../commonStyles/map/MenuWithCloseButton'

export function ReportingsButton() {
  const dispatch = useAppDispatch()
  const global = useAppSelector(state => state.global)
  const mainWindow = useAppSelector(state => state.mainWindow)

  const toggleSearchReportings = () => {
    dispatch(globalActions.hideDialogs())
    dispatch(reduceReportingFormOnMap())
    dispatch(globalActions.setDisplayedItems({ isSearchReportingsVisible: !global.isSearchReportingsVisible }))
  }

  return (
    <Wrapper
      $isShrinked={
        mainWindow.isSideDialogOpen ||
        (global.reportingFormVisibility.context === ReportingContext.MAP &&
          global.reportingFormVisibility.visibility !== VisibilityState.NONE)
      }
    >
      {global.isSearchReportingsVisible && <SearchReportings />}
      <MenuWithCloseButton.ButtonOnMap
        className={global.isSearchReportingsVisible ? '_active' : undefined}
        data-cy="reportings-button"
        Icon={Icon.Report}
        onClick={toggleSearchReportings}
        size={Size.LARGE}
        title="Chercher des signalements"
      />
    </Wrapper>
  )
}

const Wrapper = styled.div<{
  $isShrinked: boolean
}>`
  position: absolute;
  top: 130px;
  right: ${p => (p.$isShrinked ? 0 : '10px')};
  display: flex;
  justify-content: flex-end;
  transition: right 0.3s ease-out;
`
