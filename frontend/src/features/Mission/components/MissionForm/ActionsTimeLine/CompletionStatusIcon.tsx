import { getIsMissionEnded } from '@features/Mission/utils'
import { Icon, THEME } from '@mtes-mct/monitor-ui'
import { ActionTypeEnum, type Mission, type NewMission } from 'domain/entities/missions'
import { useFormikContext } from 'formik'
import styled from 'styled-components'

import { useMissionAndActionsCompletion } from '../hooks/useMissionAndActionsCompletion'

export function CompletionStatusIcon({ action }) {
  const {
    values: { endDateTimeUtc }
  } = useFormikContext<Partial<Mission | NewMission>>()
  const { actionsMissingFields } = useMissionAndActionsCompletion()
  const isMissionEnded = getIsMissionEnded(endDateTimeUtc)
  const isControlOrSuveillance =
    action.actionType === ActionTypeEnum.CONTROL || action.actionType === ActionTypeEnum.SURVEILLANCE

  if (!isControlOrSuveillance) {
    return null
  }
  if (actionsMissingFields[action.id] === 0) {
    return (
      <Wrapper>
        <Icon.Confirm color={THEME.color.mediumSeaGreen} data-cy="action-all-fields-completed" size={20} />
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <Icon.AttentionFilled
        color={isMissionEnded ? THEME.color.maximumRed : THEME.color.charcoal}
        data-cy="action-contains-missing-fields"
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  margin-top: 4px;
  margin-left: 12px;
`
