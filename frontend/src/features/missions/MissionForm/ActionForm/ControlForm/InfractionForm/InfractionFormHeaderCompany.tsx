import { FormikTextInput } from '@mtes-mct/monitor-ui'

export function InfractionFormHeaderCompany({ infractionPath }) {
  return (
    <>
      <FormikTextInput label="Nom de la personne morale" name={`${infractionPath}.companyName`} />

      <FormikTextInput
        data-cy="infraction-form-controlledPersonIdentity"
        label="Identité de la personne contrôlée"
        name={`${infractionPath}.controlledPersonIdentity`}
      />
    </>
  )
}
