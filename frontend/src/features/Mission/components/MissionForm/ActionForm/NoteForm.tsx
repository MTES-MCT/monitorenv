import { actionFactory } from '@features/Mission/Missions.helpers'
import { Accent, Button, FormikTextarea, Icon, Size, THEME } from '@mtes-mct/monitor-ui'
import { useField, useFormikContext } from 'formik'
import { useCallback } from 'react'

import { Header, HeaderButtons, StyledDeleteIconButton, TitleWithIcon } from './style'
import { type EnvAction, type EnvActionNote, type Mission } from '../../../../../domain/entities/missions'
import { FormTitle, Separator } from '../style'

export function NoteForm({ currentActionId, remove }) {
  const [actionsFields] = useField<EnvAction[]>('envActions')
  const {
    setFieldValue,
    values: { envActions }
  } = useFormikContext<Mission<EnvActionNote>>()
  const envActionIndex = actionsFields.value.findIndex(envAction => envAction.id === currentActionId)
  const currentAction = envActions[envActionIndex]

  const handleRemoveAction = () => {
    remove(currentActionId)
  }

  const duplicateNote = useCallback(() => {
    if (!currentAction) {
      return
    }
    const duplicatedAction = actionFactory(currentAction)
    setFieldValue('envActions', [duplicatedAction, ...(envActions || [])])
  }, [currentAction, setFieldValue, envActions])

  return (
    <>
      <Header>
        <TitleWithIcon>
          <Icon.Note color={THEME.color.gunMetal} />
          <FormTitle>Note</FormTitle>
        </TitleWithIcon>

        <HeaderButtons>
          <Button accent={Accent.SECONDARY} Icon={Icon.Duplicate} onClick={duplicateNote} size={Size.SMALL}>
            Dupliquer
          </Button>

          <StyledDeleteIconButton
            accent={Accent.SECONDARY}
            Icon={Icon.Delete}
            onClick={handleRemoveAction}
            size={Size.SMALL}
            title="supprimer"
          />
        </HeaderButtons>
      </Header>
      <Separator />
      <FormikTextarea isLight label="Observations" name={`envActions[${envActionIndex}].observations`} />
    </>
  )
}
