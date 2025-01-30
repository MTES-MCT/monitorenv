import { MenuWithCloseButton } from '@features/commonStyles/map/MenuWithCloseButton'
import { reduceReportingFormOnMap } from '@features/Reportings/useCases/reduceReportingFormOnMap'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Icon, Size } from '@mtes-mct/monitor-ui'
import { globalActions } from 'domain/shared_slices/Global'

import { SearchReportings } from './SearchReportings'

export function ReportingsButton() {
  const dispatch = useAppDispatch()
  const isSearchReportingsVisible = useAppSelector(state => state.global.visibility.isSearchReportingsVisible)

  const toggleSearchReportings = () => {
    dispatch(globalActions.hideSideButtons())
    dispatch(reduceReportingFormOnMap())
    dispatch(globalActions.setDisplayedItems({ visibility: { isSearchReportingsVisible: !isSearchReportingsVisible } }))
  }

  return (
    <>
      {isSearchReportingsVisible && <SearchReportings />}
      <MenuWithCloseButton.ButtonOnMap
        className={isSearchReportingsVisible ? '_active' : undefined}
        data-cy="reportings-button"
        Icon={Icon.Report}
        onClick={toggleSearchReportings}
        size={Size.LARGE}
        title="Chercher des signalements"
      />
    </>
  )
}
