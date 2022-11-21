import { format, isValid } from 'date-fns'
import { fr } from 'date-fns/locale'
import styled from 'styled-components'

import { COLORS } from '../../../../constants/constants'
import { actionTargetTypeEnum } from '../../../../domain/entities/missions'
import { ControlInfractionsTags } from '../../../../ui/ControlInfractionsTags'

export function ControlCard({ feature }) {
  const { actionNumberOfControls, actionStartDateTimeUtc, actionTargetType, actionTheme, infractions } =
    feature.getProperties()
  const parsedActionStartDateTimeUtc = new Date(actionStartDateTimeUtc)

  return (
    <ControlCardHeader>
      <Col1>
        <ControlDate>
          {isValid(parsedActionStartDateTimeUtc) &&
            format(parsedActionStartDateTimeUtc, 'dd MMM à HH:mm', { locale: fr })}
        </ControlDate>
      </Col1>
      <Col2>
        <Theme>{actionTheme}</Theme>
        <Actions>
          <Accented>
            {actionNumberOfControls || 0} contrôle{actionNumberOfControls > 1 ? 's' : ''}
          </Accented>{' '}
          réalisé{actionNumberOfControls > 1 ? 's' : ''} sur des cibles de type{' '}
          <Accented>{actionTargetTypeEnum[actionTargetType]?.libelle || 'non spécifié'}</Accented>
        </Actions>
        {infractions && (
          <ControlInfractionsTags actionNumberOfControls={actionNumberOfControls} infractions={infractions} />
        )}
      </Col2>
    </ControlCardHeader>
  )
}

const ControlCardHeader = styled.div`
  background: ${COLORS.white};
  padding: 4px 5px 5px 5px;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  display: flex;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.3);
  padding: 18px;
`

const ControlDate = styled.div``

const Theme = styled.div``
const Actions = styled.div`
  margin-bottom: 8px;
`

const Col1 = styled.div`
  width: 120px;
`
const Col2 = styled.div`
  width: 330px;
`
const Accented = styled.span`
  font-weight: 500;
`
