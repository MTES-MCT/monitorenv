import { EMPTY_VALUE } from '@features/VigilanceArea/constants'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { displaySubTags, displayTags } from '@utils/getTagsAsOptions'
import { displaySubThemes, displayThemes } from '@utils/getThemesAsOptions'

import { PanelInlineItem, PanelInlineItemLabel, PanelInlineItemValue, PanelSubPart } from '../style'

export function PanelThemesAndTags({ vigilanceArea }: { vigilanceArea: VigilanceArea.VigilanceArea | undefined }) {
  const subThemes = displaySubThemes(vigilanceArea?.themes)
  const subTags = displaySubTags(vigilanceArea?.tags)

  return (
    <PanelSubPart>
      <PanelInlineItem>
        <PanelInlineItemLabel $isInline>Thématique(s)</PanelInlineItemLabel>
        <PanelInlineItemValue $maxLine={2} title={displayThemes(vigilanceArea?.themes) ?? ''}>
          {vigilanceArea?.themes && vigilanceArea?.themes.length > 0
            ? displayThemes(vigilanceArea?.themes)
            : EMPTY_VALUE}
        </PanelInlineItemValue>
      </PanelInlineItem>
      {subThemes && (
        <PanelInlineItem>
          <PanelInlineItemLabel $isInline>Sous-thém.</PanelInlineItemLabel>
          <PanelInlineItemValue $maxLine={2} title={subThemes}>
            {subThemes}
          </PanelInlineItemValue>
        </PanelInlineItem>
      )}
      <PanelInlineItem>
        <PanelInlineItemLabel $isInline>Tag(s)</PanelInlineItemLabel>
        <PanelInlineItemValue $maxLine={2} title={displayTags(vigilanceArea?.tags) ?? ''}>
          {vigilanceArea?.tags && vigilanceArea?.tags.length > 0 ? displayTags(vigilanceArea?.tags) : EMPTY_VALUE}
        </PanelInlineItemValue>
      </PanelInlineItem>
      {subTags && (
        <PanelInlineItem>
          <PanelInlineItemLabel $isInline>Sous-tag(s)</PanelInlineItemLabel>
          <PanelInlineItemValue $maxLine={2} title={subTags}>
            {subTags}
          </PanelInlineItemValue>
        </PanelInlineItem>
      )}

      <PanelInlineItem>
        <PanelInlineItemLabel $isInline>Visibilité</PanelInlineItemLabel>
        <PanelInlineItemValue>
          {vigilanceArea?.visibility ? VigilanceArea.VisibilityLabel[vigilanceArea?.visibility] : EMPTY_VALUE}
        </PanelInlineItemValue>
      </PanelInlineItem>
    </PanelSubPart>
  )
}
