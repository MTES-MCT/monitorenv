import { MenuWithCloseButton } from '@features/commonStyles/map/MenuWithCloseButton'
import { NumberOfFilters } from '@features/map/shared/style'
import { INITIAL_STATE as initialFilters } from '@features/Reportings/Filters/slice'
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

  const {
    actionsFilter,
    isAttachedToMissionFilter,
    isUnattachedToMissionFilter,
    periodFilter,
    seaFrontFilter,
    sourceFilter,
    sourceTypeFilter,
    statusFilter,
    tagFilter,
    targetTypeFilter,
    themeFilter,
    typeFilter
  } = useAppSelector(state => state.reportingFilters)

  const {
    actionsFilter: initialActionsFilters,
    isAttachedToMissionFilter: initialIsAttachedToMissionFilter,
    isUnattachedToMissionFilter: initialIsUnattachedToMissionFilter,
    periodFilter: initialPeriodFilter,
    seaFrontFilter: initialSeaFrontFilter,
    sourceFilter: initialSourceFilter,
    sourceTypeFilter: initialSourceTypeFilter,
    statusFilter: initialStatusFilter,
    tagFilter: initialTagFilter,
    targetTypeFilter: initialTargetTypeFilter,
    themeFilter: initialThemeFilter,
    typeFilter: initialTypeFilter
  } = initialFilters

  const nbFilters =
    (actionsFilter?.length !== initialActionsFilters?.length ? 1 : 0) +
    (isAttachedToMissionFilter !== initialIsAttachedToMissionFilter ? 1 : 0) +
    (isUnattachedToMissionFilter !== initialIsUnattachedToMissionFilter ? 1 : 0) +
    (periodFilter?.length !== initialPeriodFilter?.length ? 1 : 0) +
    (seaFrontFilter?.length !== initialSeaFrontFilter?.length ? 1 : 0) +
    (sourceFilter?.length !== initialSourceFilter?.length ? 1 : 0) +
    (sourceTypeFilter?.length !== initialSourceTypeFilter?.length ? 1 : 0) +
    (statusFilter?.length !== initialStatusFilter?.length ? 1 : 0) +
    (tagFilter?.length !== initialTagFilter?.length ? 1 : 0) +
    (themeFilter?.length !== initialThemeFilter?.length ? 1 : 0) +
    (typeFilter?.length !== initialTypeFilter?.length ? 1 : 0) +
    (targetTypeFilter !== initialTargetTypeFilter ? 1 : 0)

  return (
    <>
      {isSearchReportingsVisible && <SearchReportings onVisibiltyChange={onVisibiltyChange} />}

      {nbFilters > 0 && <NumberOfFilters data-cy="reporting-number-filters">{nbFilters}</NumberOfFilters>}
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
