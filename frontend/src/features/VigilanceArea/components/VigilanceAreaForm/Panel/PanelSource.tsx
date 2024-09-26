import { EMPTY_VALUE } from '@features/VigilanceArea/constants'

import { PanelInlineItem, PanelInlineItemLabel, PanelInlineItemValue, PanelInternText, PanelSubPart } from '../style'

export function PanelSource({ createdBy, source }: { createdBy: string | undefined; source: string | undefined }) {
  return (
    <PanelSubPart>
      <PanelInternText>Section interne CACEM</PanelInternText>
      <PanelInlineItem>
        <PanelInlineItemLabel>Créé par</PanelInlineItemLabel>
        <PanelInlineItemValue>{createdBy ?? EMPTY_VALUE}</PanelInlineItemValue>
      </PanelInlineItem>
      {source && (
        <PanelInlineItem>
          <PanelInlineItemLabel>Source</PanelInlineItemLabel>
          <PanelInlineItemValue $maxLine={2} title={source}>
            {source}
          </PanelInlineItemValue>
        </PanelInlineItem>
      )}
    </PanelSubPart>
  )
}
