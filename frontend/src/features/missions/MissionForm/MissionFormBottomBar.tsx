import { Icon, Button, Accent } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import _ from 'lodash'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'

import type { Mission } from '../../../domain/entities/missions'
import type { MouseEventHandler } from 'react'

type MissionFormBottomBarProps = {
  allowClose: boolean
  allowDelete: boolean
  allowEdit: boolean
  closeMission: MouseEventHandler<HTMLButtonElement>
  deleteMission: MouseEventHandler<HTMLButtonElement>
  isFromMonitorFish: boolean
  quitFormEditing: MouseEventHandler<HTMLButtonElement>
  reopenMission: MouseEventHandler<HTMLButtonElement>
  saveMission: MouseEventHandler<HTMLButtonElement>
}
export function MissionFormBottomBar({
  allowClose,
  allowDelete,
  allowEdit,
  closeMission,
  deleteMission,
  isFromMonitorFish,
  quitFormEditing,
  reopenMission,
  saveMission
}: MissionFormBottomBarProps) {
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

  return (
    <Footer>
      <FormActionsWrapper>
        {allowDelete && (
          <StyledButton
            accent={Accent.SECONDARY}
            data-cy="delete-mission"
            disabled={isFromMonitorFish}
            Icon={Icon.Delete}
            onClick={deleteMission}
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
        {!allowClose && allowEdit && (
          <MessageRed>Veuillez rouvrir la mission avant d&apos;en modifier les informations.</MessageRed>
        )}
        <Button accent={Accent.TERTIARY} data-cy="quit-edit-mission" onClick={quitFormEditing} type="button">
          Quitter
        </Button>
        {allowClose && allowEdit && (
          <>
            <Button accent={Accent.PRIMARY} data-cy="save-mission" Icon={Icon.Save} onClick={saveMission} type="button">
              Enregistrer et quitter
            </Button>
            <Button
              accent={Accent.SECONDARY}
              data-cy="close-mission"
              Icon={Icon.Save}
              onClick={closeMission}
              type="button"
            >
              Enregistrer et clôturer
            </Button>
          </>
        )}
        {!allowClose && allowEdit && (
          <Button
            accent={Accent.PRIMARY}
            data-cy="reopen-mission"
            Icon={Icon.Unlock}
            onClick={reopenMission}
            type="button"
          >
            Rouvrir la mission
          </Button>
        )}
      </FormActionsWrapper>
    </Footer>
  )
}

const Separator = styled.div`
  flex: 1;
`
const MessageRed = styled.div`
  color: ${COLORS.maximumRed};
  padding-top: 6px;
  font-style: italic;
`
const Footer = styled.div`
  border-top: 1px solid ${COLORS.lightGray};
  padding: 16px;
`
const FormActionsWrapper = styled.div`
  display: flex;
  gap: 16px;
`
const StyledButton = styled(Button)`
  :not([disabled]) {
    svg {
      color: ${COLORS.maximumRed};
    }
  }
`
