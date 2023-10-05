import { Accent, Button, Icon, Size } from '@mtes-mct/monitor-ui'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useFormikContext } from 'formik'
import { useEffect, useState } from 'react'

import { useGetReportingQuery } from '../../../../api/reportingsAPI'
import {
  MapInteractionListenerEnum,
  updateMapInteractionListeners
} from '../../../../domain/use_cases/map/updateMapInteractionListeners'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'

import type { Mission } from '../../../../domain/entities/missions'

export function AttachReporting() {
  const { setFieldValue, values } = useFormikContext<Mission>()
  const dispatch = useAppDispatch()
  const attachedReportingIds = useAppSelector(state => state.attachReportingToMission.attachedReportingIds)
  const attachedReportings = useAppSelector(state => state.attachReportingToMission.attachedReportings)

  const [lastAddedReportingId, setLastAddedReportingId] = useState<number | undefined>(undefined)

  const { data: reportingToAttach } = useGetReportingQuery(
    lastAddedReportingId && attachedReportingIds && attachedReportingIds.length > 0 ? lastAddedReportingId : skipToken
  )

  useEffect(() => {
    if (lastAddedReportingId && reportingToAttach && reportingToAttach.id === lastAddedReportingId) {
      setFieldValue('attachedReportingIds', attachedReportingIds)
      setFieldValue('attachedReportings', [...attachedReportings, reportingToAttach])
    }
  }, [attachedReportingIds, attachedReportings, lastAddedReportingId, reportingToAttach, setFieldValue])

  useEffect(() => {
    if (attachedReportingIds.length !== values?.attachedReportingIds?.length) {
      setLastAddedReportingId(attachedReportingIds[attachedReportingIds.length - 1])
    }
  }, [attachedReportingIds, values?.attachedReportingIds?.length])

  const attachReporting = () => {
    dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.ATTACH_REPORTING))
  }

  return (
    <Button accent={Accent.SECONDARY} Icon={Icon.Link} onClick={attachReporting} size={Size.SMALL}>
      Lier un signalement
    </Button>
  )
}
