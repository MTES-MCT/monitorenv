import { Icon, THEME, customDayjs } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'

import { TargetTypeLabels } from '../../../../../../../domain/entities/targetType'
import { useGetControlPlansByYear } from '../../../../../../../hooks/useGetControlPlansByYear'
import { extractThemesAsText } from '../../../../../../../utils/extractThemesAsText'
import { ControlInfractionsTags } from '../../../../ControlInfractionsTags'
import { Accented, ControlSummary, SummaryContent, Title } from '../style'

import type { Mission } from '../../../../../../../domain/entities/missions'

export function ControlCard({ action }) {
  const { values } = useFormikContext<Mission>()
  const year = customDayjs(action.actionStartDateTimeUtc || values.startDateTimeUtc || new Date().toISOString()).year()
  const { themesByYear } = useGetControlPlansByYear({
    year
  })

  return (
    <>
      <Icon.ControlUnit color={THEME.color.charcoal} size={20} />
      <SummaryContent>
        <Title>
          Contrôle{!!action.actionNumberOfControls && action.actionNumberOfControls > 1 ? 's ' : ' '}
          {action.controlPlans?.length > 0 && action.controlPlans[0]?.themeId ? (
            <Accented>{extractThemesAsText(action.controlPlans, themesByYear)}</Accented>
          ) : (
            'à renseigner'
          )}
        </Title>

        <div>
          {!!action.actionNumberOfControls && action.actionNumberOfControls > 0 && (
            <ControlSummary>
              <Accented>{action.actionNumberOfControls}</Accented>
              {` contrôle${action.actionNumberOfControls > 1 ? 's' : ''}`}
              {` réalisé${action.actionNumberOfControls > 1 ? 's' : ''} sur des cibles de type `}
              <Accented>
                {(!!action.actionTargetType && TargetTypeLabels[action.actionTargetType]) || 'non spécifié'}
              </Accented>
            </ControlSummary>
          )}

          {!!action.actionNumberOfControls && action.actionNumberOfControls > 0 && (
            <ControlInfractionsTags
              actionNumberOfControls={action.actionNumberOfControls}
              infractions={action?.infractions}
            />
          )}
        </div>
      </SummaryContent>
    </>
  )
}
