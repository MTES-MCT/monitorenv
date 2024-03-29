import { Accent, FormikTextarea, Icon, Size, THEME } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'

import { Header, StyledDeleteButton, TitleWithIcon } from './style'
import { type EnvAction } from '../../../../domain/entities/missions'
import { FormTitle } from '../style'

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
        <TitleWithIcon>
          <Icon.Note color={THEME.color.gunMetal} />
          <FormTitle>Note</FormTitle>
        </TitleWithIcon>

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

      <FormikTextarea isLight label="Observations" name={`envActions[${envActionIndex}].observations`} />
    </>
  )
}
