import { FormikTextInput } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export function InfractionFormHeaderCompany({ infractionPath }) {
  return (
    <SubGroup>
      <FormikTextInput label="Nom de la personne morale" name={`${infractionPath}.companyName`} />
    </SubGroup>
  )
}

const SubGroup = styled.div`
  margin-bottom: 16px;
`
