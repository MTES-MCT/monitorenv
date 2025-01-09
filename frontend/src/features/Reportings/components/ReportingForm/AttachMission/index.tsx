import { createMissionFromReporting } from '@features/Reportings/useCases/createMissionFromReporting'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Button, customDayjs, FormikCheckbox, Icon } from '@mtes-mct/monitor-ui'
import { useReportingEventContext } from 'context/reporting/useReportingEventContext'
import { removeOverlayStroke } from 'domain/shared_slices/Global'
import {
  MapInteractionListenerEnum,
  updateMapInteractionListeners
} from 'domain/use_cases/map/updateMapInteractionListeners'
import { useFormikContext } from 'formik'
import { isEmpty } from 'lodash'
import { useEffect } from 'react'
import styled from 'styled-components'

import { AttachedMissionCard } from './AttachedMissionCard'
import { attachMissionToReportingSliceActions } from './slice'

import type { Reporting } from 'domain/entities/reporting'

export function AttachMission() {
  const { setFieldValue, validateForm, values } = useFormikContext<Reporting>()
  const dispatch = useAppDispatch()
  const missionId = useAppSelector(state => state.attachMissionToReporting.missionId)
  const attachedMission = useAppSelector(state => state.attachMissionToReporting.attachedMission)

  const { getReportingEventById } = useReportingEventContext()
  const reportingEvent = getReportingEventById(values.id)

  const attachMission = () => {
    dispatch(removeOverlayStroke())
    dispatch(attachMissionToReportingSliceActions.setInitialAttachedMission(values.attachedMission))
    dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.ATTACH_MISSION))
  }

  const unattachMission = async () => {
    await dispatch(attachMissionToReportingSliceActions.resetAttachMissionState())
    setFieldValue('detachedFromMissionAtUtc', customDayjs().utc().format())
    setFieldValue('attachedEnvActionId', null)
    setFieldValue('hasNoUnitAvailable', false)
    setFieldValue('missionId', null)
    setFieldValue('attachedMission', null)
  }

  const createMission = async () => {
    const errors = await validateForm()
    const isValid = isEmpty(errors)
    if (!isValid) {
      return
    }
    await dispatch(createMissionFromReporting(values))
  }

  // the form listens to the redux store to update the attached mission
  // because of the map interaction to attach mission
  useEffect(() => {
    if (reportingEvent) {
      return
    }
    if ((missionId && missionId !== values.missionId) || (!missionId && values.missionId)) {
      setFieldValue('missionId', missionId ?? null)
      setFieldValue('attachedMission', attachedMission)
      setFieldValue('attachedToMissionAtUtc', customDayjs().utc().format())
      setFieldValue('detachedFromMissionAtUtc', null)
      setFieldValue('hasNoUnitAvailable', false)
    }
  }, [
    missionId,
    setFieldValue,
    dispatch,
    values.missionId,
    attachedMission,
    values.attachedToMissionAtUtc,
    reportingEvent
  ])

  const isButtonDisabled = !values.isControlRequired || values.isArchived

  return !values.missionId || (values.missionId && values.detachedFromMissionAtUtc) ? (
    <ButtonsContainer>
      <Button
        accent={Accent.SECONDARY}
        data-cy="attach-mission-button"
        disabled={isButtonDisabled}
        Icon={Icon.Link}
        isFullWidth
        onClick={attachMission}
      >
        Lier à une mission existante
      </Button>
      <Button
        accent={Accent.SECONDARY}
        disabled={isButtonDisabled}
        Icon={Icon.Plus}
        isFullWidth
        onClick={createMission}
      >
        Créer une mission pour ce signalement
      </Button>
      <FormikCheckbox disabled={isButtonDisabled} label="Aucune unité disponible" name="hasNoUnitAvailable" />
    </ButtonsContainer>
  ) : (
    <div>
      <AttachedMissionText>
        <Icon.Link />
        <span>Signalement lié à une mission</span>
      </AttachedMissionText>

      <AttachedMissionCard attachedMission={values.attachedMission} controlStatus={values?.controlStatus} />

      <UnattachButtonContainer>
        <Button
          accent={Accent.SECONDARY}
          data-cy="unattach-mission-button"
          disabled={values.isArchived}
          Icon={Icon.Unlink}
          isFullWidth={false}
          onClick={unattachMission}
        >
          Détacher la mission
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
