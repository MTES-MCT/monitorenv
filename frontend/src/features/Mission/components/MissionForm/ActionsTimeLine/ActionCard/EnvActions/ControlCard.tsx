import { Icon, THEME } from '@mtes-mct/monitor-ui'
import { type EnvActionControl } from 'domain/entities/missions'
import styled from 'styled-components'

import { TargetTypeLabels } from '../../../../../../../domain/entities/targetType'
import { ControlInfractionsTags } from '../../../../ControlInfractionsTags'
import { Accented, ControlSummary, StyledTag, SummaryContent, Title } from '../style'

type ControlCardProps = {
  action: EnvActionControl
  attachedReportingId: string
}

export function ControlCard({ action, attachedReportingId }: ControlCardProps) {
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

          <TagContainer>
            {!!action.actionNumberOfControls && action.actionNumberOfControls > 0 && (
              <ControlInfractionsTags
                actionNumberOfControls={action.actionNumberOfControls}
                infractions={action?.infractions}
              />
            )}
            {attachedReportingId && (
              <ReportingTag
                data-cy="control-attached-reporting-tag"
                Icon={Icon.Link}
              >{`Signalement ${attachedReportingId}`}</ReportingTag>
            )}
          </TagContainer>
        </div>
      </SummaryContent>
    </>
  )
}

const TagContainer = styled.div`
  display: flex;
  justify-content: end;
  margin-top: 8px;
`

const ReportingTag = styled(StyledTag)`
  margin-top: auto;
  max-width: 50%;
  justify-content: center;
`
