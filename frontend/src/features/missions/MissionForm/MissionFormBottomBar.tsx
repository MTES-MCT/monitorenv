import { Icon, Button, Accent, customDayjs, humanizePastDate } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import { useMemo, type MouseEventHandler } from 'react'
import styled from 'styled-components'

import { MissionSourceEnum, missionSourceEnum, type Mission } from '../../../domain/entities/missions'
import { AutoSaveTag } from '../../commonComponents/AutoSaveTag'
import { isMissionNew } from '../utils'

type MissionFormBottomBarProps = {
  isAutoSaveEnabled: boolean
  onDeleteMission: MouseEventHandler<HTMLButtonElement>
  onQuitFormEditing: MouseEventHandler<HTMLButtonElement>
  onSaveMission: MouseEventHandler<HTMLButtonElement>
}

export function MissionFormBottomBar({
  isAutoSaveEnabled,
  onDeleteMission,
  onQuitFormEditing,
  onSaveMission
}: MissionFormBottomBarProps) {
  const { values } = useFormikContext<Mission>()
  const missionIsNewMission = useMemo(() => isMissionNew(values?.id), [values?.id])
  const allowEditMission =
    values?.missionSource === undefined ||
    values?.missionSource === MissionSourceEnum.MONITORENV ||
    values?.missionSource === MissionSourceEnum.MONITORFISH

  const allowDeleteMission = !missionIsNewMission && allowEditMission

  const isFromMonitorFish = values.missionSource === MissionSourceEnum.MONITORFISH

  const formattedUpdatedDate = useMemo(
    () => values.updatedAtUtc && humanizePastDate(values.updatedAtUtc),
    [values.updatedAtUtc]
  )

  return (
    <Footer>
      {allowDeleteMission && (
        <StyledButton
          accent={Accent.SECONDARY}
          data-cy="delete-mission"
          disabled={isFromMonitorFish}
          Icon={Icon.Delete}
          onClick={onDeleteMission}
          type="button"
        >
          Supprimer la mission
        </StyledButton>
      )}
      <Separator />
      <MissionInfos>
        <span>
          {!values?.createdAtUtc && <>Mission non créée.</>}
          {values?.createdAtUtc && (
            <>
              Mission créée par le {missionSourceEnum[values?.missionSource]?.label} le{' '}
              {customDayjs(values.createdAtUtc).utc().format('DD/MM/YYYY à HH[h]mm')}.
            </>
          )}
          {values?.updatedAtUtc && <> Dernière modification enregistrée {formattedUpdatedDate}.</>}
        </span>
      </MissionInfos>
      <Separator />
      <StyledButtonsContainer>
        <AutoSaveTag isAutoSaveEnabled={isAutoSaveEnabled} />
        <Button
          accent={isAutoSaveEnabled ? Accent.PRIMARY : Accent.SECONDARY}
          data-cy="quit-edit-mission"
          onClick={onQuitFormEditing}
          type="button"
        >
          Fermer
        </Button>
        {!isAutoSaveEnabled && allowEditMission && (
          <Button data-cy="save-mission" onClick={onSaveMission} type="button">
            Enregistrer
          </Button>
        )}
      </StyledButtonsContainer>
    </Footer>
  )
}

const MissionInfos = styled.div`
  color: ${p => p.theme.color.slateGray};
  font-style: italic;
  > span {
    font-weight: 500;
  }
`

const Separator = styled.div`
  flex: 1;
`

const Footer = styled.div`
  align-items: center;
  border-top: 1px solid ${p => p.theme.color.lightGray};
  display: flex;
  gap: 16px;
  justify-content: space-between;
  padding: 16px 24px;
`
const StyledButtonsContainer = styled.div`
  display: flex;
  gap: 16px;
`

const StyledButton = styled(Button)`
  &:not([disabled]) {
    svg {
      color: ${p => p.theme.color.maximumRed};
    }
  }
`
