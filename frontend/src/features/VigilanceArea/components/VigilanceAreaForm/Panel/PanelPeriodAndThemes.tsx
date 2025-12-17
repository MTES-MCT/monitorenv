import { EMPTY_VALUE } from '@features/VigilanceArea/constants'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { endingOccurenceText, frequencyText } from '@features/VigilanceArea/utils'
import { customDayjs } from '@mtes-mct/monitor-ui'
import { displaySubTags, displayTags } from '@utils/getTagsAsOptions'
import { displaySubThemes, displayThemes } from '@utils/getThemesAsOptions'

import {
  PanelDateItem,
  PanelInlineItem,
  PanelInlineItemLabel,
  PanelInlineItemValue,
  PanelSubPart,
  StyledPanelInlineItemValue
} from '../style'

export function PanelPeriodAndThemes({ vigilanceArea }: { vigilanceArea: VigilanceArea.VigilanceArea | undefined }) {
  const formattedStartPeriod =
    vigilanceArea?.periods && vigilanceArea?.periods[0]?.startDatePeriod
      ? customDayjs(vigilanceArea?.periods[0]?.startDatePeriod).utc().format('DD/MM/YYYY')
      : undefined
  const formattedEndPeriod =
    vigilanceArea?.periods && vigilanceArea?.periods[0]?.endDatePeriod
      ? customDayjs(vigilanceArea?.periods[0]?.endDatePeriod).utc().format('DD/MM/YYYY')
      : undefined

  const subThemes = displaySubThemes(vigilanceArea?.themes)
  const subTags = displaySubTags(vigilanceArea?.tags)

  return (
    <>
      <PanelSubPart>
        <PanelInlineItem>
          <PanelInlineItemLabel $isInline>Période</PanelInlineItemLabel>
          <PanelDateItem>
            {vigilanceArea?.periods && vigilanceArea?.periods[0]?.isAtAllTimes ? (
              <PanelInlineItemValue>En tout temps</PanelInlineItemValue>
            ) : (
              <>
                <PanelInlineItemValue>
                  {formattedStartPeriod ? `Du ${formattedStartPeriod} au ${formattedEndPeriod}` : EMPTY_VALUE}
                </PanelInlineItemValue>
                <PanelInlineItemValue>
                  {frequencyText(vigilanceArea?.periods && vigilanceArea?.periods[0]?.frequency)}
                </PanelInlineItemValue>
                <StyledPanelInlineItemValue>
                  {endingOccurenceText(
                    vigilanceArea?.periods && vigilanceArea?.periods[0]?.endingCondition,
                    vigilanceArea?.periods && vigilanceArea?.periods[0]?.computedEndDate
                  )}
                </StyledPanelInlineItemValue>
              </>
            )}
          </PanelDateItem>
        </PanelInlineItem>
        <PanelInlineItem>
          <PanelInlineItemLabel $isInline>Thématiques</PanelInlineItemLabel>
          <PanelInlineItemValue $maxLine={2} title={displayThemes(vigilanceArea?.themes) ?? ''}>
            {vigilanceArea?.themes && vigilanceArea?.themes.length > 0
              ? displayThemes(vigilanceArea?.themes)
              : EMPTY_VALUE}
          </PanelInlineItemValue>
        </PanelInlineItem>
        {subThemes && (
          <PanelInlineItem>
            <PanelInlineItemLabel $isInline>Sous-thématiques</PanelInlineItemLabel>
            <PanelInlineItemValue $maxLine={2} title={subThemes}>
              {subThemes}
            </PanelInlineItemValue>
          </PanelInlineItem>
        )}
        <PanelInlineItem>
          <PanelInlineItemLabel $isInline>Tags</PanelInlineItemLabel>
          <PanelInlineItemValue $maxLine={2} title={displayTags(vigilanceArea?.tags) ?? ''}>
            {vigilanceArea?.tags && vigilanceArea?.tags.length > 0 ? displayTags(vigilanceArea?.tags) : EMPTY_VALUE}
          </PanelInlineItemValue>
        </PanelInlineItem>
        {subTags && (
          <PanelInlineItem>
            <PanelInlineItemLabel $isInline>Sous-tags</PanelInlineItemLabel>
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
    </>
  )
}
