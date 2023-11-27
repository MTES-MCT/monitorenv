import { Accent, Button, Icon } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import styled from 'styled-components'

import {
  MapInteractionListenerEnum,
  updateMapInteractionListeners
} from '../../../../domain/use_cases/map/updateMapInteractionListeners'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { attachReportingToMissionSliceActions } from '../../slice'

import type { Mission } from '../../../../domain/entities/missions'

export function AttachReporting() {
  const { values } = useFormikContext<Mission>()
  const dispatch = useAppDispatch()

  const attachReporting = () => {
    dispatch(
      attachReportingToMissionSliceActions.setInitialAttachedReportings({
        ids: values.attachedReportingIds,
        reportings: values.attachedReportings
      })
    )
    dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.ATTACH_REPORTING))
  }

  return (
    <StyledButton accent={Accent.SECONDARY} Icon={Icon.Link} onClick={attachReporting}>
      Lier un signalement
    </StyledButton>
  )
}
// TODO delete padding when Monitor-ui component have good padding
const StyledButton = styled(Button)`
  padding: 4px 12px;
  > span {
    line-height: 1.5846;
  }
`
