import { EMPTY_VALUE } from '@features/VigilanceArea/constants'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { endingOccurenceText, frequencyText } from '@features/VigilanceArea/utils'
import { customDayjs } from '@mtes-mct/monitor-ui'
import { displaySubTags, displayTags } from '@utils/getTagsAsOptions'
import { displaySubThemes, displayThemes } from '@utils/getThemesAsOptions'
import styled from 'styled-components'

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
    <>
      <PanelSubPart>
        <StyledUpsertDates>
          {vigilanceArea?.createdAt &&
            `Créée le ${customDayjs(vigilanceArea?.createdAt).utc().format('DD/MM/YY')}${
              vigilanceArea?.updatedAt ? ', ' : '.'
            }`}
          {vigilanceArea?.updatedAt &&
            `dernière modification le ${customDayjs(vigilanceArea?.updatedAt).utc().format('DD/MM/YY')}.`}
        </StyledUpsertDates>
        <PanelInlineItem>
          <PanelInlineItemLabel $isInline>Période</PanelInlineItemLabel>
          <PanelDateItem>
            {vigilanceArea?.isAtAllTimes ? (
              <PanelInlineItemValue>En tout temps</PanelInlineItemValue>
            ) : (
              <>
                <PanelInlineItemValue>
                  {formattedStartPeriod ? `Du ${formattedStartPeriod} au ${formattedEndPeriod}` : EMPTY_VALUE}
                </PanelInlineItemValue>
                <PanelInlineItemValue>{frequencyText(vigilanceArea?.frequency)}</PanelInlineItemValue>
                <StyledPanelInlineItemValue>
                  {endingOccurenceText(vigilanceArea?.endingCondition, vigilanceArea?.computedEndDate)}
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
        <PanelInlineItem>
          <PanelInlineItemLabel $isInline>Sous-thématiques</PanelInlineItemLabel>
          <PanelInlineItemValue $maxLine={2} title={displaySubThemes(vigilanceArea?.themes) ?? ''}>
            {vigilanceArea?.themes && vigilanceArea?.themes.length > 0
              ? displaySubThemes(vigilanceArea?.themes)
              : EMPTY_VALUE}
          </PanelInlineItemValue>
        </PanelInlineItem>
        <PanelInlineItem>
          <PanelInlineItemLabel $isInline>Tags</PanelInlineItemLabel>
          <PanelInlineItemValue $maxLine={2} title={displayTags(vigilanceArea?.tags) ?? ''}>
            {vigilanceArea?.tags && vigilanceArea?.tags.length > 0 ? displayTags(vigilanceArea?.tags) : EMPTY_VALUE}
          </PanelInlineItemValue>
        </PanelInlineItem>
        <PanelInlineItem>
          <PanelInlineItemLabel $isInline>Sous-tags</PanelInlineItemLabel>
          <PanelInlineItemValue $maxLine={2} title={displaySubTags(vigilanceArea?.tags) ?? ''}>
            {vigilanceArea?.tags && vigilanceArea?.tags.length > 0 ? displaySubTags(vigilanceArea?.tags) : EMPTY_VALUE}
          </PanelInlineItemValue>
        </PanelInlineItem>
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

const StyledUpsertDates = styled.span`
  font-style: italic;
  color: ${p => p.theme.color.slateGray};
  transform: translateY(-8px);
`
