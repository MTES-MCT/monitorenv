import { FormikTextInput, Icon } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'

import { FieldWithButton } from './FieldWithButton'

import type { ControlUnitContactFormValues } from '../types'

export function FormikPhoneField() {
  const { errors, setFieldValue, values } = useFormikContext<ControlUnitContactFormValues>()

  const toggle = () => {
    setFieldValue('isSmsSubscriptionContact', !values.isSmsSubscriptionContact)
  }

  // TODO Add subscription icon in monitor-ui and replace `Icon.Vms` with it.
  return (
    <FieldWithButton>
      <FormikTextInput
        isLight
        label="Numéro de téléphone"
        name="phone"
        readOnly={values.isSmsSubscriptionContact}
        type="tel"
      />

      {values.isSmsSubscriptionContact ? (
        <FieldWithButton.IconButtonOn
          Icon={Icon.Vms}
          onClick={toggle}
          title="Désinscrire ce numéro de la liste de diffusion"
        />
      ) : (
        <FieldWithButton.IconButtonOff
          disabled={!values.phone || !!errors.phone}
          Icon={Icon.Vms}
          onClick={toggle}
          title="Inscrire ce numéro à la liste de diffusion"
        />
      )}
    </FieldWithButton>
  )
}
