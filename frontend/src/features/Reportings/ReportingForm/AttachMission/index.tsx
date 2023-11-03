import { Accent, Button, FormikCheckbox, Icon } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import { useEffect } from 'react'
import styled from 'styled-components'

import { AttachedMissionCard } from './AttachedMissionCard'
import { attachMissionToReportingSliceActions } from './slice'
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
  const attachedMission = useAppSelector(state => state.attachMissionToReporting.attachedMission)

  const attachMission = () => {
    dispatch(attachMissionToReportingSliceActions.setInitialAttachedMission(values.attachedMission))
    dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.ATTACH_MISSION))
  }

  const unattachMission = () => {
    setFieldValue('detachedFromMissionAtUtc', new Date().toISOString())
    setFieldValue('attachedEnvActionId', null)
  }

  const createMission = async () => {
    setIsAttachNewMission(true)
    handleSubmit()
  }

  // the form listens to the redux store to update the attached mission
  // because of the map interaction to attach mission
  useEffect(() => {
    if (missionId !== values.missionId) {
      setFieldValue('missionId', missionId)
      setFieldValue('attachedMission', attachedMission)
      setFieldValue('attachedToMissionAtUtc', new Date().toISOString())
      setFieldValue('detachedFromMissionAtUtc', undefined)
    }
  }, [missionId, setFieldValue, dispatch, values.missionId, attachedMission])

  return !values.missionId || (values.missionId && values.detachedFromMissionAtUtc) ? (
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

      <AttachedMissionCard attachedMission={values.attachedMission} controlStatus={values?.controlStatus} />

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
