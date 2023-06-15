import { Icon, Button, Accent } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import _ from 'lodash'
import { useState, type MouseEventHandler } from 'react'
import styled from 'styled-components'

import type { Mission } from '../../../domain/entities/missions'

type MissionFormBottomBarProps = {
  allowClose: boolean
  allowDelete: boolean
  allowEdit: boolean
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
  isFromMonitorFish,
  onCloseMission,
  onDeleteMission,
  onQuitFormEditing,
  onReopenMission,
  onSaveMission
}: MissionFormBottomBarProps) {
  const [isReopenMessageVisible, setIsReopenMessageVisible] = useState(false)

  const { errors } = useFormikContext<Mission>()

  const { envActions, ...errorsWithoutEnvActions } = errors

  const updatedEnvActionsErrors = Array.isArray(envActions)
    ? (envActions as Array<Record<string, any>>).filter(error => error !== null)
    : null

  const cleanedErrors = {
    ...errorsWithoutEnvActions,
    ...(updatedEnvActionsErrors &&
      updatedEnvActionsErrors.length > 0 && {
        envActions: updatedEnvActionsErrors
      })
  }

  const onClickReopenMission = e => {
    setIsReopenMessageVisible(true)
    onReopenMission(e)
  }

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
      {!_.isEmpty(cleanedErrors) && (
        <MessageRed data-cy="mission-errors">Veuillez corriger les éléments en rouge</MessageRed>
      )}
      <Separator />
      {isReopenMessageVisible && <StyledMessage>La mission a bien été réouverte</StyledMessage>}

      <Button accent={Accent.TERTIARY} data-cy="quit-edit-mission" onClick={onQuitFormEditing} type="button">
        Quitter
      </Button>

      <StyledButtonsContainer>
        {allowEdit && (
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
            Enregistrer et clôturer
          </Button>
        )}
      </StyledButtonsContainer>

      {!allowClose && allowEdit && (
        <Button
          accent={Accent.SECONDARY}
          data-cy="reopen-mission"
          Icon={Icon.Unlock}
          onClick={onClickReopenMission}
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
const MessageRed = styled.div`
  color: ${p => p.theme.color.maximumRed};
  padding-top: 6px;
  font-style: italic;
`

const StyledMessage = styled.div`
  color: ${p => p.theme.color.mediumSeaGreen};
  padding-top: 6px;
  font-style: italic;
`
const Footer = styled.div`
  border-top: 1px solid ${p => p.theme.color.lightGray};
  padding: 16px;
  gap: 16px;
  display: flex;
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
