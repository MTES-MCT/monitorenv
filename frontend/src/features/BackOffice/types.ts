import type { ConfirmationModalProps } from '../../components/ConfirmationModal'
import type { DialogProps } from '../../components/Dialog'

export type ConfirmationModalState = {
  actionType: BackOfficeConfirmationModalActionType
  /** ID of the targeted entity. */
  entityId: number
  modalProps: Omit<ConfirmationModalProps, 'onCancel' | 'onConfirm'>
}

export type DialogState = {
  dialogProps: Omit<DialogProps, 'onClose'>
}

export enum BackOfficeConfirmationModalActionType {
  'ARCHIVE_ADMINISTRATION' = 'ARCHIVE_ADMINISTRATION',
  'ARCHIVE_CONTROL_UNIT' = 'ARCHIVE_CONTROL_UNIT',
  'DELETE_ADMINISTRATION' = 'DELETE_ADMINISTRATION',
  'DELETE_CONTROL_UNIT' = 'DELETE_CONTROL_UNIT'
}
