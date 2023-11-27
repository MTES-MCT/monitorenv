import { Icon, Size } from '@mtes-mct/monitor-ui'

import { SearchReportings } from './SearchReportings'
import { globalActions } from '../../../domain/shared_slices/Global'
import { reduceReportingFormOnMap } from '../../../domain/use_cases/reporting/reduceReportingFormOnMap'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { MenuWithCloseButton } from '../../commonStyles/map/MenuWithCloseButton'
import { ButtonWrapper } from '../../MainWindow/components/RightMenu/ButtonWrapper'

export function ReportingsButton() {
  const dispatch = useAppDispatch()
  const isSearchReportingsVisible = useAppSelector(state => state.global.isSearchReportingsVisible)

  const toggleSearchReportings = () => {
    dispatch(globalActions.hideSideButtons())
    dispatch(reduceReportingFormOnMap())
    dispatch(globalActions.setDisplayedItems({ isSearchReportingsVisible: !isSearchReportingsVisible }))
  }

  return (
    <ButtonWrapper topPosition={130}>
      {isSearchReportingsVisible && <SearchReportings />}
      <MenuWithCloseButton.ButtonOnMap
        className={isSearchReportingsVisible ? '_active' : undefined}
        data-cy="reportings-button"
        Icon={Icon.Report}
        onClick={toggleSearchReportings}
        size={Size.LARGE}
        title="Chercher des signalements"
      />
    </ButtonWrapper>
  )
}
