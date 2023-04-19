import { Icon, Button, Accent } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import _ from 'lodash'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'

import type { Mission } from '../../../domain/entities/missions'

export function MissionFormBottomBar({
  allowDelete,
  allowEdit,
  closeMission,
  deleteMission,
  isClosed,
  quitFormEditing,
  reopenMission
}) {
  const { errors } = useFormikContext<Mission>()

  return (
    <Footer>
      <FormActionsWrapper>
        {allowDelete && (
          <Button
            accent={Accent.SECONDARY}
            data-cy="delete-mission"
            Icon={Icon.Delete}
            onClick={deleteMission}
            type="button"
          >
            Supprimer la mission
          </Button>
        )}
        <Separator />
        {!_.isEmpty(errors) && <MessageRed>Veuillez corriger les éléments en rouge</MessageRed>}
        <Separator />
        {isClosed && allowEdit && (
          <MessageRed>Veuillez rouvrir la mission avant d&apos;en modifier les informations.</MessageRed>
        )}
        <Button accent={Accent.TERTIARY} data-cy="quit-edit-mission" onClick={quitFormEditing} type="button">
          Quitter
        </Button>
        {!isClosed && allowEdit && (
          <>
            <Button accent={Accent.PRIMARY} data-cy="save-mission" Icon={Icon.Save} type="submit">
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
        {isClosed && allowEdit && (
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
  padding-top: 7px;
  font-style: italic;
`
const Footer = styled.div`
  border-top: 1px solid ${COLORS.lightGray};
  padding: 18px;
`
const FormActionsWrapper = styled.div`
  display: flex;
`
