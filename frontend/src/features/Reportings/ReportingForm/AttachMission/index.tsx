import { Accent, Button, FormikCheckbox, Icon } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import { useEffect } from 'react'
import styled from 'styled-components'

import { AttachedMissionCard } from './AttachedMissionCard'
import { Layers } from '../../../../domain/entities/layers/constants'
import { ReportingContext, removeOverlayCoordinatesByName } from '../../../../domain/shared_slices/Global'
import {
  MapInteractionListenerEnum,
  updateMapInteractionListeners
} from '../../../../domain/use_cases/map/updateMapInteractionListeners'
import { unattachMissionFromReporting } from '../../../../domain/use_cases/reporting/unattachMissionFromReporting'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { attachMissionToReportingSliceActions } from '../../slice'

import type { Reporting } from '../../../../domain/entities/reporting'

export function AttachMission({ onAttachMission }) {
  const { handleSubmit, setFieldValue, values } = useFormikContext<Reporting>()
  const dispatch = useAppDispatch()
  const missionId = useAppSelector(state => state.attachMissionToReporting.missionId)
  const attachedMission = useAppSelector(state => state.attachMissionToReporting.attachedMission)
  const activeReportingId = useAppSelector(state => state.reporting.activeReportingId)
  const reportingContext = useAppSelector(state =>
    activeReportingId ? state.reporting.reportings[activeReportingId]?.context : undefined
  )

  const attachMission = () => {
    dispatch(removeOverlayCoordinatesByName(Layers.REPORTINGS.code))
    dispatch(attachMissionToReportingSliceActions.setInitialAttachedMission(values.attachedMission))
    dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.ATTACH_MISSION))
  }

  const unattachMission = () => {
    setFieldValue('detachedFromMissionAtUtc', new Date().toISOString())
    setFieldValue('attachedEnvActionId', null)
    setFieldValue('hasNoUnitAvailable', false)

    const valuesUpdated = {
      ...values,
      attachedEnvActionId: undefined,
      detachedFromMissionAtUtc: new Date().toISOString(),
      hasNoUnitAvailable: false
    }

    dispatch(unattachMissionFromReporting(valuesUpdated, reportingContext || ReportingContext.MAP))
  }

  const createMission = async () => {
    onAttachMission(true)
    handleSubmit()
  }

  // the form listens to the redux store to update the attached mission
  // because of the map interaction to attach mission
  useEffect(() => {
    if ((missionId && missionId !== values.missionId) || (!missionId && values.missionId)) {
      setFieldValue('missionId', missionId)
      setFieldValue('attachedMission', attachedMission)
      setFieldValue('attachedToMissionAtUtc', new Date().toISOString())
      setFieldValue('detachedFromMissionAtUtc', undefined)
      setFieldValue('hasNoUnitAvailable', false)
    }
  }, [missionId, setFieldValue, dispatch, values.missionId, attachedMission])

  const isButtonDisabled = !values.isControlRequired || values.isArchived

  return !values.missionId || (values.missionId && values.detachedFromMissionAtUtc) ? (
    <ButtonsContainer>
      <Button
        accent={Accent.SECONDARY}
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
