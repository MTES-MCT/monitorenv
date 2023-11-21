import { Icon, THEME } from '@mtes-mct/monitor-ui'

import { Accented, DurationWrapper, SummaryContent, Title, TitleAndButtonsContainer } from './style'
import { dateDifferenceInHours } from '../../../../utils/dateDifferenceInHours'
import { extractThemesAsText } from '../../../../utils/extractThemesAsText'

export function SurveillanceCard({ action }) {
  return (
    <>
      <Icon.Observation color={THEME.color.charcoal} size={20} />
      <SummaryContent>
        <TitleAndButtonsContainer>
          <Title>
            Surveillance{' '}
            {action.themes && action.themes?.length > 0 ? (
              <Accented>{extractThemesAsText(action.themes)}</Accented>
            ) : (
              'à renseigner'
            )}
          </Title>
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
