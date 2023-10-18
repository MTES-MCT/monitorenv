import type { DialogProps } from '../../components/Dialog'

export type DialogState = {
  dialogProps: Omit<DialogProps, 'onClose'>
}
