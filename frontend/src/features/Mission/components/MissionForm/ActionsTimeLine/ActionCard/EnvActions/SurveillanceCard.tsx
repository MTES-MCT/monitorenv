import { Icon, THEME } from '@mtes-mct/monitor-ui'

import { dateDifferenceInHours } from '../../../../../../../utils/dateDifferenceInHours'
import { Accented, DurationWrapper, SummaryContent, Title, TitleAndButtonsContainer } from '../style'

import type { EnvActionSurveillance } from 'domain/entities/missions'

type SurveillanceCardProps = {
  action: EnvActionSurveillance
}

export function SurveillanceCard({ action }: SurveillanceCardProps) {
  const themes = action.themes?.map(theme => theme.name).join(' - ')

  return (
    <>
      <Icon.Observation color={THEME.color.charcoal} size={20} />
      <SummaryContent>
        <TitleAndButtonsContainer>
          <Title>Surveillance {themes ? <Accented>{themes}</Accented> : 'à renseigner'}</Title>
        </TitleAndButtonsContainer>
        {action.actionStartDateTimeUtc && action.actionEndDateTimeUtc && (
          <DurationWrapper>
            <Accented>
              {dateDifferenceInHours(action.actionStartDateTimeUtc, action.actionEndDateTimeUtc)} heure(s)&nbsp;
            </Accented>
            de surveillance
          </DurationWrapper>
        )}
      </SummaryContent>
    </>
  )
}
