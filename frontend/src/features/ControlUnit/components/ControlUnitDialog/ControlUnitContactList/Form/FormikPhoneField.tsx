import { FormikTextInput, Icon } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'

import { FieldWithButton } from './FieldWithButton'

export function FormikPhoneField() {
  const [input, , props] = useField<boolean>('isSmsSubscriptionContact')

  const toggleSubscription = () => {
    props.setValue(!input.value)
  }

  return (
    <FieldWithButton>
      <FormikTextInput isLight label="Numéro de téléphone" name="phone" type="tel" />

      {input.value ? (
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
