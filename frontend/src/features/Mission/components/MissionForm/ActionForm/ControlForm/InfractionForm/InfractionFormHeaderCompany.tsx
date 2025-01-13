import { FormikTextInput } from '@mtes-mct/monitor-ui'

type InfractionHeaderType = {
  infractionPath: string
  isDisabled: boolean
}
export function InfractionFormHeaderCompany({ infractionPath, isDisabled }: InfractionHeaderType) {
  return (
    <>
      <FormikTextInput
        disabled={isDisabled}
        isErrorMessageHidden
        isUndefinedWhenDisabled
        label="Nom de la personne morale"
        name={`${infractionPath}.companyName`}
      />

      <FormikTextInput
        data-cy="infraction-form-controlledPersonIdentity"
        disabled={isDisabled}
        isErrorMessageHidden
        isUndefinedWhenDisabled
        label="Identité de la personne contrôlée"
        name={`${infractionPath}.controlledPersonIdentity`}
      />
    </>
  )
}
