import { getLocalizedDayjs } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { COLORS } from '../../../../constants/constants'
import { actionTargetTypeEnum } from '../../../../domain/entities/missions'
import { ControlInfractionsTags } from '../../../../ui/ControlInfractionsTags'
import { extractThemesAsText } from '../../../../utils/extractThemesAsText'
import { pluralize } from '../../../../utils/pluralize'

export function ControlCard({ feature }: { feature: any }) {
  const { actionNumberOfControls, actionStartDateTimeUtc, actionTargetType, infractions, themes } =
    feature.getProperties()
  const parsedActionStartDateTimeUtc = new Date(actionStartDateTimeUtc)
  const actionDate = getLocalizedDayjs(parsedActionStartDateTimeUtc).format('DD MMM à HH:mm')

  return (
    <ControlCardHeader>
      <Actions>
        <div>
          {themes?.length > 0 && themes[0]?.theme ? <Accented>{extractThemesAsText(themes)}</Accented> : 'à renseigner'}
        </div>{' '}
        <Accented>
          {actionNumberOfControls} {pluralize('contrôle', actionNumberOfControls)}
          {' ('}
          {actionTargetTypeEnum[actionTargetType]?.libelle || 'non spécifié'}
          {' )'}
          <Bullet color={infractions.length > 0 ? COLORS.maximumRed : COLORS.mediumSeaGreen} />
        </Accented>
      </Actions>
      {infractions && (
        <ControlInfractionsTags actionNumberOfControls={actionNumberOfControls} infractions={infractions} />
      )}
      <DateControl>{actionDate}</DateControl>
    </ControlCardHeader>
  )
}

const ControlCardHeader = styled.div`
  background: ${COLORS.white};
  padding: 12px;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.3);
  min-width: 300px;
  gap: 10px;
`

const Actions = styled.div`
  font-weight: 500;
`
const Accented = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 5px;
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
