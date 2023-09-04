import { Icon, Size } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { SearchReportings } from './SearchReportings'
import { setDisplayedItems } from '../../../domain/shared_slices/Global'
import { ReportingContext, VisibilityState } from '../../../domain/shared_slices/ReportingState'
import { reduceReportingForm } from '../../../domain/use_cases/reduceReportingForm'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { MenuWithCloseButton } from '../../commonStyles/map/MenuWithCloseButton'

export function ReportingsButton() {
  const dispatch = useAppDispatch()
  const { isSearchReportingsVisible, reportingFormVisibility } = useAppSelector(state => state.global)

  const toggleSearchReportings = () => {
    dispatch(
      setDisplayedItems({
        isMapToolVisible: undefined,
        isSearchMissionsVisible: false,
        isSearchReportingsVisible: !isSearchReportingsVisible,
        isSearchSemaphoreVisible: false
      })
    )
    dispatch(reduceReportingForm())
  }

  return (
    <Wrapper
      reportingFormVisibility={
        reportingFormVisibility.context === ReportingContext.MAP
          ? reportingFormVisibility.visibility
          : VisibilityState.NONE
      }
    >
      {isSearchReportingsVisible && <SearchReportings />}
      <MenuWithCloseButton.ButtonOnMap
        className={isSearchReportingsVisible ? '_active' : undefined}
        data-cy="reportings-button"
        Icon={Icon.Report}
        onClick={toggleSearchReportings}
        size={Size.LARGE}
        title="Chercher des signalements"
      />
    </Wrapper>
  )
}

const Wrapper = styled.div<{ reportingFormVisibility: VisibilityState }>`
  position: absolute;
  top: 130px;
  right: ${p => (p.reportingFormVisibility === VisibilityState.VISIBLE ? '0' : '10')}px;
  display: flex;
  justify-content: flex-end;
  transition: right 0.3s ease-out;
`
