import { Accent, Button, Icon, Size } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'

import { attachReportingToMissionSliceActions } from './slice'
import {
  MapInteractionListenerEnum,
  updateMapInteractionListeners
} from '../../../../domain/use_cases/map/updateMapInteractionListeners'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'

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
    <Button accent={Accent.SECONDARY} Icon={Icon.Link} onClick={attachReporting} size={Size.SMALL}>
      Lier un signalement
    </Button>
  )
}
