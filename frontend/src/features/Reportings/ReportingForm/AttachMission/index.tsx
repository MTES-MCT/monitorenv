import { Accent, Button, Icon } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import { useEffect } from 'react'
import styled from 'styled-components'

import { AttachedMissionCard } from './AttachedMissionCard'
import { attachMissionToReportingSliceActions } from './slice'
import { resetInteraction } from '../../../../domain/shared_slices/Draw'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'

import type { Reporting } from '../../../../domain/entities/reporting'

export function AttachMission() {
  const { setFieldValue, values } = useFormikContext<Reporting>()
  const dispatch = useAppDispatch()
  const attachedMissionId = useAppSelector(state => state.attachReportingToMission.attachedMissionId)

  const attachMission = () => {
    dispatch(resetInteraction())
    dispatch(attachMissionToReportingSliceActions.setInitialAttachedMissionId(values.attachedMissionId))
    dispatch(attachMissionToReportingSliceActions.setAttachMissionListener(true))
  }

  const unattachMission = () => {
    dispatch(attachMissionToReportingSliceActions.setAttachedMissionId(undefined))
  }

  useEffect(() => {
    setFieldValue('attachedMissionId', attachedMissionId)
  }, [attachedMissionId, setFieldValue])

  return !values.attachedMissionId ? (
    <Button accent={Accent.SECONDARY} Icon={Icon.Plus} onClick={attachMission}>
      Lier à une mission existante
    </Button>
  ) : (
    <div>
      <AttachedMissionText>
        <Icon.Link />
        <span>Signalement lié à une mission</span>
      </AttachedMissionText>

      <AttachedMissionCard id={attachedMissionId} />

      <ButtonContainer>
        <Button accent={Accent.SECONDARY} Icon={Icon.Unlink} isFullWidth={false} onClick={unattachMission}>
          Délier de la mission
        </Button>
      </ButtonContainer>
    </div>
  )
}

const AttachedMissionText = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${p => p.theme.color.gunMetal};
  padding-bottom: 8px;
`

const ButtonContainer = styled.div`
  text-align: end;
  padding-top: 16px;
`
