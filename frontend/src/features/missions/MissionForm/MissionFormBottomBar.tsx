import { Icon, Button, Accent, customDayjs, humanizePastDate } from '@mtes-mct/monitor-ui'
import { isNewMission } from '@utils/isNewMission'
import { useFormikContext } from 'formik'
import { useMemo, type MouseEventHandler } from 'react'
import styled from 'styled-components'

import { AutoSaveTag } from './AutoSaveTag'
import { missionSourceEnum, type Mission } from '../../../domain/entities/missions'

type MissionFormBottomBarProps = {
  allowClose: boolean
  allowDelete: boolean
  allowEdit: boolean
  isAutoSaveEnabled: boolean
  isFromMonitorFish: boolean
  onCloseMission: MouseEventHandler<HTMLButtonElement>
  onDeleteMission: MouseEventHandler<HTMLButtonElement>
  onQuitFormEditing: MouseEventHandler<HTMLButtonElement>
  onReopenMission: MouseEventHandler<HTMLButtonElement>
  onSaveMission: MouseEventHandler<HTMLButtonElement>
}
export function MissionFormBottomBar({
  allowClose,
  allowDelete,
  allowEdit,
  isAutoSaveEnabled,
  isFromMonitorFish,
  onCloseMission,
  onDeleteMission,
  onQuitFormEditing,
  onReopenMission,
  onSaveMission
}: MissionFormBottomBarProps) {
  const { values } = useFormikContext<Mission>()
  const missionIsNewMission = useMemo(() => isNewMission(values?.id), [values?.id])

  const formattedUpdatedDate = useMemo(
    () => values.updatedAtUtc && humanizePastDate(values.updatedAtUtc),
    [values.updatedAtUtc]
  )

  return (
    <Footer>
      {allowDelete && (
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
          {!values?.createdAtUtc && <>Mission non enregistrée.</>}
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
        {allowClose && allowEdit && (
          <Button
            accent={Accent.SECONDARY}
            data-cy="close-mission"
            disabled={missionIsNewMission}
            onClick={onCloseMission}
            type="button"
          >
            Clôturer
          </Button>
        )}

        {!allowClose && allowEdit && (
          <Button
            accent={Accent.SECONDARY}
            data-cy="reopen-mission"
            Icon={Icon.Unlock}
            onClick={onReopenMission}
            type="button"
          >
            Rouvrir la mission
          </Button>
        )}
        <Button
          accent={isAutoSaveEnabled ? Accent.PRIMARY : Accent.SECONDARY}
          data-cy="quit-edit-mission"
          onClick={onQuitFormEditing}
          type="button"
        >
          Fermer
        </Button>
        {!isAutoSaveEnabled && allowEdit && (
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
  :not([disabled]) {
    svg {
      color: ${p => p.theme.color.maximumRed};
    }
  }
`
