import { FormikTextInput } from '@mtes-mct/monitor-ui'

export function InfractionFormHeaderIndividual({ infractionPath }) {
  return (
    <FormikTextInput
      data-cy="infraction-form-controlledPersonIdentity"
      label="Identité de la personne contrôlée"
      name={`${infractionPath}.controlledPersonIdentity`}
    />
  )
}
