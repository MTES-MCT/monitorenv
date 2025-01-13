import { FormikTextInput } from '@mtes-mct/monitor-ui'

type InfractionHeaderType = {
  infractionPath: string
  isDisabled: boolean
}
export function InfractionFormHeaderIndividual({ infractionPath, isDisabled }: InfractionHeaderType) {
  return (
    <FormikTextInput
      data-cy="infraction-form-controlledPersonIdentity"
      disabled={isDisabled}
      isErrorMessageHidden
      isUndefinedWhenDisabled
      label="Identité de la personne contrôlée"
      name={`${infractionPath}.controlledPersonIdentity`}
    />
  )
}
