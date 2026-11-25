import { RegulatoryArea } from '@features/RegulatoryArea/types'
import { Checkbox } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import styled from 'styled-components'

export function FieldsListFromGroup({ inheritedFields }: { inheritedFields?: string[] }) {
  const { setFieldValue } = useFormikContext()
  const updateInheritedFields = (checked: boolean | undefined, itemValue: string) => {
    if (checked) {
      setFieldValue('inheritedFields', [...(inheritedFields ?? []), itemValue])
    } else {
      setFieldValue(
        'inheritedFields',
        inheritedFields?.filter(field => field !== itemValue)
      )
    }
  }

  return (
    <Wrapper>
      <div>
        <Title>Éléments par défaut du groupe</Title>
        <Text>
          Décocher un champ défini par défaut au niveau du groupe pour le rendre éditable et y indiquer une autre valeur
        </Text>
      </div>
      <FieldsWrapper>
        {inheritedFields?.map(item => (
          <Checkbox
            key={item}
            checked={inheritedFields?.includes(item)}
            label={RegulatoryArea.DATA_FROM_GROUP.find(field => field.value === item)?.label}
            name={item}
            onChange={checked => updateInheritedFields(checked, item)}
          />
        ))}
      </FieldsWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background-color: ${p => p.theme.color.blueGray25};
  border: 1px solid ${p => p.theme.color.blueGray};
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
`

const Title = styled.p`
  color: #45688a;
  font-weight: bold;
`
const Text = styled.span`
  color: ${p => p.theme.color.slateGray};
`
const FieldsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`
