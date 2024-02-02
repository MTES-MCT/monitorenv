import { Accent, FormikTextarea, Icon, Size } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import { Form } from 'rsuite'
import styled from 'styled-components'

import { Header, StyledDeleteButton, Title } from './style'
import { type EnvAction } from '../../../../domain/entities/missions'
import { ReactComponent as NoteSVG } from '../../../../uiMonitor/icons/Note_libre.svg'

export function NoteForm({ currentActionIndex, remove, setCurrentActionIndex }) {
  const [actionsFields] = useField<EnvAction[]>('envActions')
  const envActionIndex = actionsFields.value.findIndex(envAction => envAction.id === String(currentActionIndex))

  const handleRemoveAction = () => {
    setCurrentActionIndex(undefined)
    remove(currentActionIndex)
  }

  return (
    <>
      <Header>
        <div>
          <NoteIcon />
          <Title>Note</Title>
        </div>

        <StyledDeleteButton
          accent={Accent.SECONDARY}
          Icon={Icon.Delete}
          onClick={handleRemoveAction}
          size={Size.SMALL}
          title="supprimer"
        >
          Supprimer
        </StyledDeleteButton>
      </Header>

      <Form.Group>
        <FormikTextarea isLight label="Observations" name={`envActions[${envActionIndex}].observations`} />
      </Form.Group>
    </>
  )
}

/* const Header = styled.div`
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
`

const Title = styled.h2`
  font-size: 16px;
  line-height: 22px;
  display: inline-block;
  color: ${p => p.theme.color.charcoal};
`
 */
const NoteIcon = styled(NoteSVG)`
  color: ${p => p.theme.color.gunMetal};
  margin-right: 8px;
  margin-top: 2px;
  width: 18px;
`

/* const StyledButton = styled(Button)`
  > div > svg {
    color: ${p => p.theme.color.maximumRed};
  }
` */
