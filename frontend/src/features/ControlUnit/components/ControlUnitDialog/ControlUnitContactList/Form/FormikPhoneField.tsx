import { FormikPhoneInput, Icon } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'

import { FieldWithButton } from './FieldWithButton'

import type { ControlUnitContactFormValues } from '../types'

export function FormikPhoneField() {
  const { errors, setFieldValue, values } = useFormikContext<ControlUnitContactFormValues>()

  const toggleSubscription = () => {
    setFieldValue('isSmsSubscriptionContact', !values.isSmsSubscriptionContact)
  }

  return (
    <FieldWithButton $hasError={!!errors.phone}>
      <FormikPhoneInput
        $isLight
        label="Numéro de téléphone"
        name="phone"
        placeholder="01 23 45 67 89 ou 00 594 123 456 789"
      />

      {values.isSmsSubscriptionContact ? (
        <FieldWithButton.IconButtonOn
          Icon={Icon.Subscription}
          onClick={toggleSubscription}
          title="Retirer ce numéro de la liste de diffusion des préavis et des bilans d’activités de contrôle"
        />
      ) : (
        <FieldWithButton.IconButtonOff
          Icon={Icon.Subscription}
          onClick={toggleSubscription}
          title="Ajouter ce numéro à la liste de diffusion des préavis et des bilans d’activités de contrôle"
        />
      )}
    </FieldWithButton>
  )
}
