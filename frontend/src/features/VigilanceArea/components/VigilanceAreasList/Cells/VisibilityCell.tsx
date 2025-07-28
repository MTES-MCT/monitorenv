import { VigilanceArea } from '@features/VigilanceArea/types'

export function VisibilityCell({ visibility }: { visibility: VigilanceArea.Visibility | undefined }) {
  if (!visibility) {
    return <span>-</span>
  }

  return <span>{VigilanceArea.VisibilityLabelForList[visibility]}</span>
}
