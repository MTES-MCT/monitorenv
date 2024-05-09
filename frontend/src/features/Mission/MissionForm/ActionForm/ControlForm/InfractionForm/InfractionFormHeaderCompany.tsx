import { FormikTextInput } from '@mtes-mct/monitor-ui'

export function InfractionFormHeaderCompany({ infractionPath }) {
  return <FormikTextInput label="Nom de la personne morale" name={`${infractionPath}.companyName`} />
}
