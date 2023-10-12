import { Icon, Size } from '@mtes-mct/monitor-ui'
import { useCallback } from 'react'
import styled from 'styled-components'

import { globalActions } from '../../../../domain/shared_slices/Global'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { MenuWithCloseButton } from '../../../commonStyles/map/MenuWithCloseButton'
import { ControlUnitListDialog } from '../../../ControlUnit/components/ControlUnitListDialog'

export function ControlUnitListButton() {
  const dispatch = useAppDispatch()
  const { isControlUnitListDialogVisible } = useAppSelector(state => state.global)

  const toggleDialog = useCallback(() => {
    dispatch(globalActions.hideSideButtons())
    dispatch(globalActions.setDisplayedItems({ isControlUnitListDialogVisible: !isControlUnitListDialogVisible }))
  }, [dispatch, isControlUnitListDialogVisible])

  return (
    <Wrapper>
      {/* TODO The right menu should be a full `MainWindow` feature component by itself. */}
      {/* We should positition related dialogs independantly, not include them here. */}
      {isControlUnitListDialogVisible && <ControlUnitListDialog onClose={toggleDialog} />}

      <MenuWithCloseButton.ButtonOnMap
        $isActive={isControlUnitListDialogVisible}
        Icon={Icon.ControlUnit}
        onClick={toggleDialog}
        size={Size.LARGE}
        title="Liste des unités de contrôle"
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: absolute;
  top: 226px;
  right: 10px;
  display: flex;
  justify-content: flex-end;
  transition: right 0.3s ease-out;
`
