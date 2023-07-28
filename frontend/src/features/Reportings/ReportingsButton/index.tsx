import { Icon, Size } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { SearchReportings } from './SearchReportings'
import { setDisplayedItems } from '../../../domain/shared_slices/Global'
import { ReportingFormVisibility } from '../../../domain/shared_slices/ReportingState'
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
        isSearchMissions: false,
        isSearchReportingsVisible: !isSearchReportingsVisible,
        isSearchSemaphoreVisible: false
      })
    )
  }

  return (
    <Wrapper reportingFormVisibility={reportingFormVisibility}>
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

const Wrapper = styled.div<{ reportingFormVisibility: ReportingFormVisibility }>`
  position: absolute;
  top: 135px;
  right: ${p => (p.reportingFormVisibility === ReportingFormVisibility.VISIBLE ? '0' : '10')}px;
  display: flex;
  justify-content: flex-end;
  transition: right 0.3s ease-out;
`
