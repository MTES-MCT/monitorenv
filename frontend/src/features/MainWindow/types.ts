import type { ConfirmationModalProps } from '../../components/ConfirmationModal'

export type ConfirmationModalState = {
  actionType: MainWindowConfirmationModalActionType
  /** ID of the targeted entity. */
  entityId: number
  modalProps: Omit<ConfirmationModalProps, 'onCancel' | 'onConfirm'>
}

export type DialogState = {
  message: string
}

export enum MainWindowConfirmationModalActionType {
  'DELETE_CONTROL_UNIT_CONTACT' = 'DELETE_CONTROL_UNIT_CONTACT',
  'DELETE_CONTROL_UNIT_RESOURCE' = 'DELETE_CONTROL_UNIT_RESOURCE'
}
