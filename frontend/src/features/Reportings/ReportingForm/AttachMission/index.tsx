import { Accent, Button, Icon } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import { useEffect } from 'react'
import styled from 'styled-components'

import { AttachedMissionCard } from './AttachedMissionCard'
import { attachMissionToReportingSliceActions } from './slice'
import { resetInteraction } from '../../../../domain/shared_slices/Draw'
import { addMission } from '../../../../domain/use_cases/missions/addMission'
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
  const createMission = () => {
    dispatch(addMission())
  }

  useEffect(() => {
    setFieldValue('attachedMissionId', attachedMissionId)
  }, [attachedMissionId, setFieldValue])

  return !values.attachedMissionId ? (
    <ButtonsContainer>
      <Button accent={Accent.SECONDARY} Icon={Icon.Link} isFullWidth onClick={attachMission}>
        Lier à une mission existante
      </Button>
      <Button accent={Accent.SECONDARY} Icon={Icon.Plus} isFullWidth onClick={createMission}>
        Créer une mission pour ce signalement
      </Button>
    </ButtonsContainer>
  ) : (
    <div>
      <AttachedMissionText>
        <Icon.Link />
        <span>Signalement lié à une mission</span>
      </AttachedMissionText>

      <AttachedMissionCard id={attachedMissionId} />

      <UnattachButtonContainer>
        <Button accent={Accent.SECONDARY} Icon={Icon.Unlink} isFullWidth={false} onClick={unattachMission}>
          Délier de la mission
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
