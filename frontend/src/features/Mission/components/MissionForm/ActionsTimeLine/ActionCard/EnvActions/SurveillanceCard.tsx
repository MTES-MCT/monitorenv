import { Icon, THEME, customDayjs } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'

import { useGetControlPlansByYear } from '../../../../../../../hooks/useGetControlPlansByYear'
import { dateDifferenceInHours } from '../../../../../../../utils/dateDifferenceInHours'
import { extractThemesAsText } from '../../../../../../../utils/extractThemesAsText'
import { Accented, DurationWrapper, SummaryContent, Title, TitleAndButtonsContainer } from '../style'

import type { Mission } from '../../../../../../../domain/entities/missions'

export function SurveillanceCard({ action }) {
  const { values } = useFormikContext<Mission>()
  const year = customDayjs(action.actionStartDateTimeUtc || values.startDateTimeUtc || new Date().toISOString()).year()
  const { themesByYear } = useGetControlPlansByYear({
    year
  })

  return (
    <>
      <Icon.Observation color={THEME.color.charcoal} size={20} />
      <SummaryContent>
        <TitleAndButtonsContainer>
          <Title>
            Surveillance{' '}
            {action.controlPlans && action.controlPlans?.length > 0 ? (
              <Accented>{extractThemesAsText(action.controlPlans, themesByYear)}</Accented>
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
