import { EMPTY_VALUE } from '@features/VigilanceArea/constants'

import { PanelInlineItemLabel, PanelInlineItemValue, PanelSubPart } from '../style'

export function PanelComments({ comments }: { comments?: string }) {
  return (
    <PanelSubPart>
      <PanelInlineItemLabel>Commentaire sur la zone</PanelInlineItemLabel>
      <PanelInlineItemValue $maxLine={8} title={comments}>
        {comments ?? EMPTY_VALUE}
      </PanelInlineItemValue>
    </PanelSubPart>
  )
}
