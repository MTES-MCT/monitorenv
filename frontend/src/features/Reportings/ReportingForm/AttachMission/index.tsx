import { Accent, Button, FormikCheckbox, Icon } from '@mtes-mct/monitor-ui'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useFormikContext } from 'formik'
import { useEffect } from 'react'
import styled from 'styled-components'

import { AttachedMissionCard } from './AttachedMissionCard'
import { attachMissionToReportingSliceActions } from './slice'
import { useGetMissionQuery } from '../../../../api/missionsAPI'
import {
  MapInteractionListenerEnum,
  updateMapInteractionListeners
} from '../../../../domain/use_cases/map/updateMapInteractionListeners'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'

import type { Reporting } from '../../../../domain/entities/reporting'

export function AttachMission({ setIsAttachNewMission }) {
  const { handleSubmit, setFieldValue, values } = useFormikContext<Reporting>()
  const dispatch = useAppDispatch()
  const missionId = useAppSelector(state => state.attachMissionToReporting.missionId)

  const hasMissionAttached = !!values.missionId && !!values.attachedMission && values.attachedMission.id === missionId
  const { data: missionToAttach } = useGetMissionQuery(!hasMissionAttached && missionId ? missionId : skipToken)

  const attachMission = () => {
    dispatch(attachMissionToReportingSliceActions.setInitialAttachedMission(values.attachedMission))
    dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.ATTACH_MISSION))
  }

  const unattachMission = () => {
    dispatch(attachMissionToReportingSliceActions.setMissionId(undefined))
    dispatch(attachMissionToReportingSliceActions.setAttachedMission(undefined))
  }

  const createMission = async () => {
    setIsAttachNewMission(true)
    handleSubmit()
  }

  useEffect(() => {
    if (missionId !== values.missionId && missionToAttach) {
      setFieldValue('missionId', missionId)
      setFieldValue('attachedMission', missionId ? missionToAttach : undefined)
    }
  }, [missionId, setFieldValue, dispatch, missionToAttach, values.missionId])

  return !values.missionId ? (
    <ButtonsContainer>
      <Button
        accent={Accent.SECONDARY}
        disabled={!values.isControlRequired}
        Icon={Icon.Link}
        isFullWidth
        onClick={attachMission}
      >
        Lier à une mission existante
      </Button>
      <Button
        accent={Accent.SECONDARY}
        disabled={!values.isControlRequired}
        Icon={Icon.Plus}
        isFullWidth
        onClick={createMission}
      >
        Créer une mission pour ce signalement
      </Button>
      <FormikCheckbox disabled={!values.isControlRequired} label="Aucune unité disponible" name="hasNoUnitAvailable" />
    </ButtonsContainer>
  ) : (
    <div>
      <AttachedMissionText>
        <Icon.Link />
        <span>Signalement lié à une mission</span>
      </AttachedMissionText>

      <AttachedMissionCard attachedEnvActionId={values?.attachedEnvActionId} attachedMission={values.attachedMission} />

      <UnattachButtonContainer>
        <Button accent={Accent.SECONDARY} Icon={Icon.Unlink} isFullWidth={false} onClick={unattachMission}>
          Délier la mission
        </Button>
      </UnattachButtonContainer>
    </div>
  )
}

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`
const AttachedMissionText = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${p => p.theme.color.gunMetal};
  padding-bottom: 8px;
`

const UnattachButtonContainer = styled.div`
  text-align: end;
  padding-top: 16px;
`
