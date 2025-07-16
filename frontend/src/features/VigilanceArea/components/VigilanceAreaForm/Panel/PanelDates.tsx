import { ValidatedAt } from '@features/VigilanceArea/components/VigilanceAreaForm/Panel/ValidateAt'
import { customDayjs } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { PanelSubPart } from '../style'

import type { VigilanceArea } from '@features/VigilanceArea/types'

export function PanelDates({
  onValidate = () => {},
  vigilanceArea
}: {
  onValidate?: () => void
  vigilanceArea: VigilanceArea.VigilanceArea | undefined
}) {
  if (!vigilanceArea?.createdAt && !vigilanceArea?.updatedAt && !vigilanceArea?.validatedAt) {
    return null
  }

  return (
    <>
      <PanelSubPart>
        <StyledDates>
          {vigilanceArea?.createdAt && `Créée le ${customDayjs(vigilanceArea.createdAt).utc().format('DD/MM/YY')}. `}
          {vigilanceArea?.updatedAt &&
            `Dernière modification le ${customDayjs(vigilanceArea.updatedAt).utc().format('DD/MM/YY')}.`}
        </StyledDates>
        {vigilanceArea?.validatedAt && (
          <ValidatedAt
            disabled={vigilanceArea.isDraft}
            onValidate={onValidate}
            validatedAt={vigilanceArea.validatedAt}
          />
        )}
      </PanelSubPart>
    </>
  )
}

const StyledDates = styled.p`
  font-style: italic;
  color: ${p => p.theme.color.slateGray};
`
