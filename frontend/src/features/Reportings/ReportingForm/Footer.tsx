import { Accent, Icon, THEME } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import _ from 'lodash'

import { StyledButton, StyledSubmitButton, StyledDeleteButton, StyledFooter } from '../style'

import type { Reporting } from '../../../domain/entities/reporting'

export function Footer({ onCancel, onDelete, setShouldValidateOnChange }) {
  const { handleSubmit, setFieldValue, validateForm, values } = useFormikContext<Partial<Reporting>>()

  const handleArchive = async () => {
    await setFieldValue('isArchived', true)
    validateForm().then(errors => {
      if (_.isEmpty(errors)) {
        handleSubmit()

        return
      }
      setShouldValidateOnChange(true)
    })
  }

  if (values.id) {
    return (
      <StyledFooter>
        <StyledDeleteButton
          accent={Accent.SECONDARY}
          color={THEME.color.maximumRed}
          Icon={Icon.Delete}
          onClick={onDelete}
        />

        <div>
          {/* TODO gérer l'archivage */}
          <StyledButton Icon={Icon.Archive} onClick={handleArchive}>
            Enregistrer et archiver
          </StyledButton>
          <StyledSubmitButton accent={Accent.SECONDARY} Icon={Icon.Save} onClick={() => handleSubmit()}>
            Enregistrer et quitter
          </StyledSubmitButton>
        </div>
      </StyledFooter>
    )
  }

  return (
    <StyledFooter $justify="end">
      <StyledButton onClick={onCancel}>Annuler</StyledButton>
      <StyledSubmitButton accent={Accent.SECONDARY} Icon={Icon.Save} onClick={() => handleSubmit()}>
        Valider le signalement
      </StyledSubmitButton>
    </StyledFooter>
  )
}
