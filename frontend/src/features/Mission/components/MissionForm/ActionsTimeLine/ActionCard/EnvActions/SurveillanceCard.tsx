import { Icon, THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { dateDifferenceInHours } from '../../../../../../../utils/dateDifferenceInHours'
import { Accented, DurationWrapper, StyledTag, SummaryContent, Title, TitleAndButtonsContainer } from '../style'

import type { EnvActionSurveillance } from 'domain/entities/missions'

type SurveillanceCardProps = {
  action: EnvActionSurveillance
  attachedReportingIds: string[]
}

export function SurveillanceCard({ action, attachedReportingIds }: SurveillanceCardProps) {
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
        <TagsContainer>
          {attachedReportingIds.map(reportingId => (
            <StyledTag
              key={reportingId}
              data-cy="surveillance-attached-reportings-tags"
              Icon={Icon.Link}
            >{`Signalement ${reportingId}`}</StyledTag>
          ))}
        </TagsContainer>
      </SummaryContent>
    </>
  )
}

const TagsContainer = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
`
