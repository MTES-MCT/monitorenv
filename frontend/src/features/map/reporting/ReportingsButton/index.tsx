import { Icon, Size } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { SearchReportings } from './SearchReportings'
import { setDisplayedItems } from '../../../../domain/shared_slices/Global'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { MenuWithCloseButton } from '../../../commonStyles/map/MenuWithCloseButton'

export function ReportingsButton() {
  const dispatch = useAppDispatch()
  const { isSearchReportingsVisible, reportingFormVisibility } = useAppSelector(state => state.global)

  const openOrCloseSearchReportings = () => {
    dispatch(
      setDisplayedItems({
        isSearchReportingsVisible: true,
        isSearchSemaphoreVisible: false,
        mapToolOpened: undefined,
        missionsMenuIsOpen: false
      })
    )
  }

  return (
    <Wrapper className={reportingFormVisibility}>
      {isSearchReportingsVisible && <SearchReportings />}
      <MenuWithCloseButton.ButtonOnMap
        className={isSearchReportingsVisible ? '_active' : undefined}
        data-cy="reportings-button"
        Icon={Icon.Report}
        onClick={openOrCloseSearchReportings}
        size={Size.LARGE}
        title="Chercher des signalements"
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: absolute;
  top: 135px;
  right: 10px;
  display: flex;
  justify-content: flex-end;
  transition: right 0.3s ease-out;
  &.visible {
    right: 0px;
  }
`
