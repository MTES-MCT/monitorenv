import { Icon, THEME } from '@mtes-mct/monitor-ui'

import { TargetTypeLabels } from '../../../../../../../domain/entities/targetType'
import { ControlInfractionsTags } from '../../../../ControlInfractionsTags'
import { Accented, ControlSummary, SummaryContent, Title } from '../style'

import type { EnvActionControl } from 'domain/entities/missions'

type ControlCardProps = {
  action: EnvActionControl
}
export function ControlCard({ action }: ControlCardProps) {
  return (
    <>
      <Icon.ControlUnit color={THEME.color.charcoal} size={20} />
      <SummaryContent>
        <Title>
          Contrôle{!!action.actionNumberOfControls && action.actionNumberOfControls > 1 ? 's ' : ' '}
          {action.themes && action.themes.length > 0 ? <Accented>{action.themes[0]?.name}</Accented> : 'à renseigner'}
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
