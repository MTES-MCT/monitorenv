import { Icon, Button, Accent, customDayjs } from '@mtes-mct/monitor-ui'
import { timeagoFrenchLocale } from '@utils/timeagoFrenchLocale'
import { useFormikContext } from 'formik'
import styled from 'styled-components'
import { format, register } from 'timeago.js'

import { AutoSaveTag } from './AutoSaveTag'
import { missionSourceEnum, type Mission } from '../../../domain/entities/missions'

import type { MouseEventHandler } from 'react'
// @ts-ignore
register('fr', timeagoFrenchLocale)

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
        {!values?.createdAtUtc && <>Mission non enregistrée.</>}
        {values?.createdAtUtc && (
          <>
            Mission créée par le {missionSourceEnum[values?.missionSource]?.label} le{' '}
            {customDayjs(values.createdAtUtc).utc().format('DD/MM/YYYY à HH:mm')} (UTC).
          </>
        )}

        {values?.updatedAtUtc && <> Dernière modification enregistrée {format(values.updatedAtUtc, 'fr')}.</>}
      </MissionInfos>
      <AutoSaveTag isAutoSaveEnabled={isAutoSaveEnabled} />
      <Separator />

      <Button accent={Accent.TERTIARY} data-cy="quit-edit-mission" onClick={onQuitFormEditing} type="button">
        Quitter
      </Button>

      <StyledButtonsContainer>
        {!isAutoSaveEnabled && allowEdit && (
          <Button accent={Accent.PRIMARY} data-cy="save-mission" Icon={Icon.Save} onClick={onSaveMission} type="button">
            Enregistrer et quitter
          </Button>
        )}

        {allowClose && allowEdit && (
          <Button
            accent={Accent.SECONDARY}
            data-cy="close-mission"
            Icon={Icon.Save}
            onClick={onCloseMission}
            type="button"
          >
            Clôturer
          </Button>
        )}
      </StyledButtonsContainer>

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
    </Footer>
  )
}

const Separator = styled.div`
  flex: 1;
`

const MissionInfos = styled.div`
  color: ${p => p.theme.color.slateGray};
  font-style: italic;
`

const Footer = styled.div`
  align-items: center;
  border-top: 1px solid ${p => p.theme.color.lightGray};
  display: flex;
  gap: 16px;
  padding: 16px;
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
