import { missionFormsActions } from '@features/Mission/components/MissionForm/slice'
import { Icon, Size } from '@mtes-mct/monitor-ui'

import { ControlUnitListDialog } from './ControlUnitListDialog'
import { globalActions } from '../../../domain/shared_slices/Global'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { MenuWithCloseButton } from '../../commonStyles/map/MenuWithCloseButton'

import type { MenuButtonProps } from '@components/Menu'

export function ControlUnitListButton({ onClickMenuButton, onVisibiltyChange }: MenuButtonProps) {
  const dispatch = useAppDispatch()
  const isControlUnitListDialogVisible = useAppSelector(state => state.global.visibility.isControlUnitListDialogVisible)

  const toggleDialog = () => {
    onClickMenuButton()
    dispatch(
      globalActions.setDisplayedItems({
        visibility: { isControlUnitListDialogVisible: !isControlUnitListDialogVisible }
      })
    )
    dispatch(missionFormsActions.setMissionCenteredControlUnitId())
  }

  return (
    <>
      {/* TODO The right menu should be a full `MainWindow` feature component by itself. */}
      {/* We should positition related dialogs independantly, not include them here. */}
      {isControlUnitListDialogVisible && (
        <ControlUnitListDialog onClose={toggleDialog} onVisibiltyChange={onVisibiltyChange} />
      )}

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
