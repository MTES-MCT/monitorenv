import { getLocalizedDayjs } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { COLORS } from '../../../../constants/constants'
import { InteractionListener } from '../../../../domain/entities/map/constants'
import { actionTargetTypeLabels } from '../../../../domain/entities/missions'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { ControlInfractionsTags } from '../../../../ui/ControlInfractionsTags'
import { extractThemesAsText } from '../../../../utils/extractThemesAsText'
import { pluralize } from '../../../../utils/pluralize'

export function ControlCard({ feature }: { feature: any }) {
  const listener = useAppSelector(state => state.draw.listener)
  const { actionNumberOfControls, actionStartDateTimeUtc, actionTargetType, infractions, themes } =
    feature.getProperties()
  const parsedActionStartDateTimeUtc = new Date(actionStartDateTimeUtc)
  const actionDate = getLocalizedDayjs(parsedActionStartDateTimeUtc).format('DD MMM à HH:mm')

  if (listener === InteractionListener.CONTROL_POINT) {
    return null
  }

  return (
    <StyledControlCardHeader>
      <StyledControlThemes>
        {themes?.length > 0 && themes[0]?.theme ? (
          <StyledThemes>{extractThemesAsText(themes)}</StyledThemes>
        ) : (
          <StyledGrayText>Thématique à renseigner</StyledGrayText>
        )}{' '}
        <Accented>
          {actionNumberOfControls} {pluralize('contrôle', actionNumberOfControls)}{' '}
          {actionTargetTypeLabels[actionTargetType]?.libelle ? (
            <>({actionTargetTypeLabels[actionTargetType]?.libelle})</>
          ) : (
            <StyledGrayText>(cible non renseignée)</StyledGrayText>
          )}
          <Bullet color={infractions.length > 0 ? COLORS.maximumRed : COLORS.mediumSeaGreen} />
        </Accented>
      </StyledControlThemes>
      {infractions && (
        <ControlInfractionsTags actionNumberOfControls={actionNumberOfControls} infractions={infractions} />
      )}
      <StyledGrayText>{actionStartDateTimeUtc ? actionDate : 'Date à renseigner'}</StyledGrayText>
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

const StyledGrayText = styled.p`
  color: ${COLORS.slateGray};
`
