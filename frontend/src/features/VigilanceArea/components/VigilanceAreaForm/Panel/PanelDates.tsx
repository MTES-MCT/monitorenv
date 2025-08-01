import { ValidatedAt } from '@features/VigilanceArea/components/VigilanceAreaForm/Panel/ValidateAt'
import { isFormValid } from '@features/VigilanceArea/components/VigilanceAreaForm/utils'
import { customDayjs } from '@mtes-mct/monitor-ui'
import { useMemo } from 'react'
import styled from 'styled-components'

import { PanelSubPart } from '../style'

import type { VigilanceArea } from '@features/VigilanceArea/types'

export function PanelDates({
  onValidate = () => {},
  readOnly = false,
  vigilanceArea
}: {
  onValidate?: () => void
  readOnly?: boolean
  vigilanceArea: VigilanceArea.VigilanceArea | undefined
}) {
  const isValid = useMemo(() => isFormValid(vigilanceArea, false), [vigilanceArea])

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
            disabled={vigilanceArea.isDraft || (!vigilanceArea.isDraft && !isValid)}
            onValidate={onValidate}
            readOnly={readOnly}
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
