import { getLocalizedDayjs } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { COLORS } from '../../../../constants/constants'
import { actionTargetTypeLabels } from '../../../../domain/entities/missions'
import { ControlInfractionsTags } from '../../../../ui/ControlInfractionsTags'
import { extractThemesAsText } from '../../../../utils/extractThemesAsText'
import { pluralize } from '../../../../utils/pluralize'

export function ControlCard({ feature }: { feature: any }) {
  const { actionNumberOfControls, actionStartDateTimeUtc, actionTargetType, infractions, themes } =
    feature.getProperties()
  const parsedActionStartDateTimeUtc = new Date(actionStartDateTimeUtc)
  const actionDate = getLocalizedDayjs(parsedActionStartDateTimeUtc).format('DD MMM à HH:mm')

  return (
    <StyledControlCardHeader>
      <StyledControlThemes>
        <StyledThemes>
          {themes?.length > 0 && themes[0]?.theme ? extractThemesAsText(themes) : 'Thématique à renseigner'}
        </StyledThemes>{' '}
        <Accented>
          {actionNumberOfControls} {pluralize('contrôle', actionNumberOfControls)}
          {' ('}
          {actionTargetTypeLabels[actionTargetType]?.libelle || 'cible non renseignée'}
          {/* eslint-disable-next-line react/jsx-curly-brace-presence */}
          {')'}
          <Bullet color={infractions.length > 0 ? COLORS.maximumRed : COLORS.mediumSeaGreen} />
        </Accented>
      </StyledControlThemes>
      {infractions && (
        <ControlInfractionsTags actionNumberOfControls={actionNumberOfControls} infractions={infractions} />
      )}
      {actionStartDateTimeUtc ? <DateControl>{actionDate}</DateControl> : <span>Date à renseigner</span>}
    </StyledControlCardHeader>
  )
}

const StyledControlCardHeader = styled.div`
  background: ${COLORS.white};
  padding: 12px;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.3);
  gap: 10px;
  flex: 0 0 200px;
`

const StyledControlThemes = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`
const StyledThemes = styled.div`
  white-space: nowrap;
  font-weight: 700;
`

const Accented = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  white-space: nowrap;
  gap: 5px;
  font-weight: 500;
`

const Bullet = styled.div<{ color: string }>`
  border-radius: 50%;
  width: 10px;
  height: 10px;
  background-color: ${p => p.color};
`

const DateControl = styled.p`
  color: ${COLORS.slateGray};
`
