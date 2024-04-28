import { FormikTextInput, Icon } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'

import { FieldWithButton } from './FieldWithButton'

export function FormikPhoneField() {
  const [field, , helpers] = useField<boolean | undefined>('isSmsSubscriptionContact')

  const toggle = () => {
    helpers.setValue(!field.value)
  }

  // TODO Add subscription icon in monitor-ui and replace `Icon.Vms` with it.
  return (
    <FieldWithButton>
      <FormikTextInput isLight label="Numéro de téléphone" name="phone" type="tel" />

      {field.value ? (
        <FieldWithButton.IconButtonOn
          Icon={Icon.Vms}
          onClick={toggle}
          title="Désinscrire ce numéro à la liste de diffusion"
        />
      ) : (
        <FieldWithButton.IconButtonOff
          Icon={Icon.Vms}
          onClick={toggle}
          title="Inscrire ce numéro à la liste de diffusion"
        />
      )}
    </FieldWithButton>
  )
}
