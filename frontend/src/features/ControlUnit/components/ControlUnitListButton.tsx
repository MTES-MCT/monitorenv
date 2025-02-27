import { Icon, Size } from '@mtes-mct/monitor-ui'
import { useCallback } from 'react'

import { ControlUnitListDialog } from './ControlUnitListDialog'
import { globalActions } from '../../../domain/shared_slices/Global'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { MenuWithCloseButton } from '../../commonStyles/map/MenuWithCloseButton'
import { reduceReportingFormOnMap } from '../../Reportings/useCases/reduceReportingFormOnMap'

export function ControlUnitListButton() {
  const dispatch = useAppDispatch()
  const isControlUnitListDialogVisible = useAppSelector(state => state.global.visibility.isControlUnitListDialogVisible)

  const toggleDialog = useCallback(() => {
    dispatch(globalActions.hideAllDialogs())
    dispatch(reduceReportingFormOnMap())
    dispatch(
      globalActions.setDisplayedItems({
        visibility: { isControlUnitListDialogVisible: !isControlUnitListDialogVisible }
      })
    )
  }, [dispatch, isControlUnitListDialogVisible])

  return (
    <>
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
    </>
  )
}
