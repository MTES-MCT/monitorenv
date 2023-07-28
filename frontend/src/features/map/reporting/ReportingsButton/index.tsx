import { Icon, Size } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { setDisplayedItems, setReportingFormVisibility } from '../../../../domain/shared_slices/Global'
import { ReportingFormVisibility } from '../../../../domain/shared_slices/ReportingState'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { MenuWithCloseButton } from '../../../commonStyles/map/MenuWithCloseButton'

export function ReportingsButton() {
  const dispatch = useAppDispatch()
  const { isSearchSemaphoreVisible, reportingFormVisibility } = useAppSelector(state => state.global)

  const openOrCloseSearchReporting = () => {
    dispatch(
      setDisplayedItems({ isSearchSemaphoreVisible: false, mapToolOpened: undefined, missionsMenuIsOpen: false })
    )
    dispatch(setReportingFormVisibility(ReportingFormVisibility.REDUCE))
  }

  return (
    <Wrapper className={reportingFormVisibility}>
      <MenuWithCloseButton.ButtonOnMap
        className={isSearchSemaphoreVisible ? '_active' : undefined}
        data-cy="semaphores-button"
        Icon={Icon.Report}
        onClick={openOrCloseSearchReporting}
        size={Size.LARGE}
        title="Chercher un sémaphore"
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
  transition: right 0.5s ease-out;
  &.visible {
    right: 0px;
  }
`
