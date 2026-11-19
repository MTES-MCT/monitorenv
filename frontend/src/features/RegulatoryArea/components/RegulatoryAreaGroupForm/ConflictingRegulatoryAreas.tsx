import { displaySubTags, displayTags } from '@utils/getTagsAsOptions'
import { displaySubThemes, displayThemes } from '@utils/getThemesAsOptions'
import styled from 'styled-components'

import type { RegulatoryArea } from '@features/RegulatoryArea/types'
import type { RegulatoryAreaGroupFields } from '@features/RegulatoryArea/useCases/usePropagation'

type ConflictingRegulatoryAreasProps = {
  field: RegulatoryAreaGroupFields
  regulatoryAreas: RegulatoryArea.RegulatoryAreaFromAPI[]
}

/** Lists the current value of the given field for each regulatory area that would be overwritten */
export function ConflictingRegulatoryAreas({ field, regulatoryAreas }: ConflictingRegulatoryAreasProps) {
  return (
    <List>
      {regulatoryAreas.map(regulatoryArea => (
        <Item key={regulatoryArea.id}>
          <AreaName>{regulatoryArea.polyName || `Zone ${regulatoryArea.id}`}</AreaName>
          <FieldValues field={field} regulatoryArea={regulatoryArea} />
        </Item>
      ))}
    </List>
  )
}

function FieldValues({
  field,
  regulatoryArea
}: {
  field: RegulatoryAreaGroupFields
  regulatoryArea: RegulatoryArea.RegulatoryAreaFromAPI
}) {
  switch (field) {
    case 'THEMES':
      return (
        <>
          <Line label="Thématiques" value={displayThemes(regulatoryArea.themes)} />
          <Line label="Sous-thématiques" value={displaySubThemes(regulatoryArea.themes)} />
        </>
      )
    case 'TAGS':
      return (
        <>
          <Line label="Tags" value={displayTags(regulatoryArea.tags)} />
          <Line label="Sous-tags" value={displaySubTags(regulatoryArea.tags)} />
        </>
      )
    case 'RESUME':
      return <Text>{regulatoryArea.resume}</Text>
    case 'AUTHORIZATION_PERIODS':
      return <Text>{regulatoryArea.authorizationPeriods}</Text>
    case 'PROHIBITION_PERIODS':
      return <Text>{regulatoryArea.prohibitionPeriods}</Text>
    default:
      return null
  }
}

function Line({ label, value }: { label: string; value?: string }) {
  if (!value) {
    return null
  }

  return (
    <Text>
      <Label>{label} :</Label> {value}
    </Text>
  )
}

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  list-style: none;
  margin: 8px 0 0;
  padding: 0;
`

const Item = styled.li`
  border-left: 2px solid ${p => p.theme.color.blueGray};
  padding-left: 8px;
`

const AreaName = styled.p`
  color: ${p => p.theme.color.gunMetal};
  font-weight: 500;
`

const Text = styled.p`
  color: ${p => p.theme.color.slateGray};
  white-space: pre-wrap;
`

const Label = styled.span`
  color: ${p => p.theme.color.gunMetal};
`
