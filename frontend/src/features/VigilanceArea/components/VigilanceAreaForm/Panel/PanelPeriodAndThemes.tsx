import { EMPTY_VALUE } from '@features/VigilanceArea/constants'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { endingOccurenceText, frequencyText } from '@features/VigilanceArea/utils'
import { customDayjs } from '@mtes-mct/monitor-ui'

import {
  PanelDateItem,
  PanelInlineItem,
  PanelInlineItemLabel,
  PanelInlineItemValue,
  PanelSubPart,
  StyledPanelInlineItemValue
} from '../style'

export function PanelPeriodAndThemes({ vigilanceArea }: { vigilanceArea: VigilanceArea.VigilanceArea | undefined }) {
  const formattedStartPeriod = vigilanceArea?.startDatePeriod
    ? customDayjs(vigilanceArea?.startDatePeriod).utc().format('DD/MM/YYYY')
    : undefined
  const formattedEndPeriod = vigilanceArea?.endDatePeriod
    ? customDayjs(vigilanceArea?.endDatePeriod).utc().format('DD/MM/YYYY')
    : undefined

  return (
    <PanelSubPart>
      <PanelInlineItem>
        <PanelInlineItemLabel $isInline>Période</PanelInlineItemLabel>
        <PanelDateItem>
          <PanelInlineItemValue>
            {formattedStartPeriod ? `Du ${formattedStartPeriod} au ${formattedEndPeriod}` : EMPTY_VALUE}
          </PanelInlineItemValue>
          <PanelInlineItemValue>{frequencyText(vigilanceArea?.frequency)}</PanelInlineItemValue>
          <StyledPanelInlineItemValue>
            {endingOccurenceText(vigilanceArea?.endingCondition, vigilanceArea?.computedEndDate)}
          </StyledPanelInlineItemValue>
        </PanelDateItem>
      </PanelInlineItem>
      <PanelInlineItem>
        <PanelInlineItemLabel $isInline>Thématique</PanelInlineItemLabel>
        <PanelInlineItemValue $maxLine={2} title={vigilanceArea?.themes ? vigilanceArea?.themes.join(', ') : ''}>
          {vigilanceArea?.themes ? vigilanceArea?.themes.join(', ') : EMPTY_VALUE}
        </PanelInlineItemValue>
      </PanelInlineItem>
      <PanelInlineItem>
        <PanelInlineItemLabel $isInline>Visibilité</PanelInlineItemLabel>
        <PanelInlineItemValue>
          {vigilanceArea?.visibility ? VigilanceArea.VisibilityLabel[vigilanceArea?.visibility] : EMPTY_VALUE}
        </PanelInlineItemValue>
      </PanelInlineItem>
    </PanelSubPart>
  )
}