import { Icon, Button, Accent } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'

export function MissionFormBottomBar({
  allowDelete,
  closeMission,
  deleteMission,
  errorOnDelete,
  errorOnSave,
  isClosed,
  quitFormEditing,
  reopenMission
}) {
  const { errors, values } = useFormikContext()
  console.log(errors, values)

  return (
    <Footer>
      <FormActionsWrapper>
        {allowDelete && !isClosed && (
          <Button Icon={Icon.Delete} onClick={deleteMission} type="button">
            Supprimer la mission
          </Button>
        )}
        <Separator />
        {JSON.stringify(errors)}
        <Separator />
        {isClosed && (
          <MsgReopenMission>Veuillez rouvrir la mission avant d&apos;en modifier les informations.</MsgReopenMission>
        )}
        <Button accent={Accent.TERTIARY} onClick={quitFormEditing} type="button">
          Quitter
        </Button>
        {!isClosed && (
          <>
            <Button accent={Accent.PRIMARY} Icon={Icon.Save} type="submit">
              Enregistrer et quitter
            </Button>
            <Button accent={Accent.SECONDARY} Icon={Icon.Save} onClick={closeMission} type="button">
              Enregistrer et clôturer
            </Button>
          </>
        )}
        {isClosed && (
          <Button accent={Accent.PRIMARY} Icon={Icon.Unlock} onClick={reopenMission} type="button">
            Rouvrir la mission
          </Button>
        )}
      </FormActionsWrapper>
      {errorOnSave && <ErrorOnSave>Oups... Erreur au moment de la sauvegarde</ErrorOnSave>}
      {errorOnDelete && <ErrorOnDelete>Oups... Erreur au moment de la suppression</ErrorOnDelete>}
    </Footer>
  )
}

const ErrorOnSave = styled.div`
  backgound: ${COLORS.goldenPoppy};
  text-align: right;
`
const ErrorOnDelete = styled.div`
  backgound: ${COLORS.goldenPoppy};
`
const Separator = styled.div`
  flex: 1;
`
const MsgReopenMission = styled.div`
  color: ${COLORS.maximumRed};
  padding-top: 7px;
`
const Footer = styled.div`
  border-top: 1px solid ${COLORS.lightGray};
  padding: 18px;
`
const FormActionsWrapper = styled.div`
  display: flex;
`
