import { MenuWithCloseButton } from '@features/commonStyles/map/MenuWithCloseButton'
import { NumberOfFilters } from '@features/map/shared/style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Icon, Size } from '@mtes-mct/monitor-ui'
import { globalActions } from 'domain/shared_slices/Global'

import { SearchReportings } from './SearchReportings'

import type { MenuButtonProps } from '@components/Menu'

export function ReportingsButton({ onClickMenuButton, onVisibiltyChange }: MenuButtonProps) {
  const dispatch = useAppDispatch()
  const isSearchReportingsVisible = useAppSelector(state => state.global.visibility.isSearchReportingsVisible)

  const toggleSearchReportings = () => {
    onClickMenuButton()
    dispatch(globalActions.setDisplayedItems({ visibility: { isSearchReportingsVisible: !isSearchReportingsVisible } }))
  }

  const nbOfFiltersSetted = useAppSelector(state => state.reportingFilters.nbOfFiltersSetted)

  return (
    <>
      {isSearchReportingsVisible && <SearchReportings onVisibiltyChange={onVisibiltyChange} />}

      {nbOfFiltersSetted > 0 && (
        <NumberOfFilters data-cy="reporting-number-filters">{nbOfFiltersSetted}</NumberOfFilters>
      )}
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
