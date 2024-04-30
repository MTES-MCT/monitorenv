import { FormikTextInput, Icon } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'

import { FieldWithButton } from './FieldWithButton'

import type { ControlUnitContactFormValues } from '../types'

export function FormikPhoneField() {
  const { setFieldValue, values } = useFormikContext<ControlUnitContactFormValues>()

  const toggle = () => {
    setFieldValue('isSmsSubscriptionContact', !values.isSmsSubscriptionContact)
  }

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
          Icon={Icon.Subscription}
          onClick={toggle}
          title="Désinscrire ce numéro de la liste de diffusion"
        />
      ) : (
        <FieldWithButton.IconButtonOff
          Icon={Icon.Subscription}
          onClick={toggle}
          title="Inscrire ce numéro à la liste de diffusion"
        />
      )}
    </FieldWithButton>
  )
}
