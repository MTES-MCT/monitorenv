import { Tooltip } from '@components/Tooltip'
import styled from 'styled-components'

import type { RegulatoryAreaGroupFields } from '@features/RegulatoryArea/hooks/usePropagation'
import type { RegulatoryArea } from '@features/RegulatoryArea/types'

type ConflictingRegulatoryAreasProps = {
  field: RegulatoryAreaGroupFields
  regulatoryAreas: RegulatoryArea.RegulatoryAreaFromAPI[]
  title: string
}

type NamedItem = { id: number; name: string }
type GroupedItem = NamedItem & { children: NamedItem[] }

export function ConflictingRegulatoryAreas({ field, regulatoryAreas, title }: ConflictingRegulatoryAreasProps) {
  return (
    <Tooltip
      linkText={`Voir les ${title.toLowerCase()} ajoutées aux zones réglementaires actuelles`}
      orientation="BOTTOM_RIGHT"
    >
      <FieldValues field={field} regulatoryAreas={regulatoryAreas} />
    </Tooltip>
  )
}

function FieldValues({
  field,
  regulatoryAreas
}: {
  field: RegulatoryAreaGroupFields
  regulatoryAreas: RegulatoryArea.RegulatoryAreaFromAPI[]
}) {
  switch (field) {
    case 'THEMES':
      return (
        <GroupedList
          items={mergeUniqueWithChildren(
            regulatoryAreas.flatMap(({ themes }) =>
              (themes ?? []).map(theme => ({ ...theme, children: theme.subThemes }))
            )
          )}
        />
      )
    case 'TAGS':
      return (
        <GroupedList
          items={mergeUniqueWithChildren(
            regulatoryAreas.flatMap(({ tags }) => (tags ?? []).map(tag => ({ ...tag, children: tag.subTags })))
          )}
        />
      )
    case 'RESUME':
      return <TextList values={regulatoryAreas.map(({ id, resume }) => ({ id, value: resume }))} />
    case 'AUTHORIZATION_PERIODS':
      return (
        <TextList
          values={regulatoryAreas.map(({ authorizationPeriods, id }) => ({ id, value: authorizationPeriods }))}
        />
      )
    case 'PROHIBITION_PERIODS':
      return (
        <TextList values={regulatoryAreas.map(({ id, prohibitionPeriods }) => ({ id, value: prohibitionPeriods }))} />
      )
    default:
      return null
  }
}

/** Merges items (themes or tags) by id, deduplicating their children, sorted by name */
function mergeUniqueWithChildren(items: GroupedItem[]): GroupedItem[] {
  const itemsById = new Map<number, { children: Map<number, NamedItem>; id: number; name: string }>()

  items.forEach(({ children, id, name }) => {
    const existing = itemsById.get(id) ?? { children: new Map<number, NamedItem>(), id, name }
    children.forEach(child => existing.children.set(child.id, { id: child.id, name: child.name }))
    itemsById.set(id, existing)
  })

  return [...itemsById.values()]
    .map(({ children, id, name }) => ({
      children: [...children.values()].sort((a, b) => a.name.localeCompare(b.name)),
      id,
      name
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

function GroupedList({ items }: { items: GroupedItem[] }) {
  if (items.length === 0) {
    return null
  }

  return (
    <List>
      {items.map(({ children, id, name }) => (
        <li key={id}>
          <ItemName>{name}</ItemName>
          {children.length > 0 && <Text>{children.map(child => child.name).join(', ')}</Text>}
        </li>
      ))}
    </List>
  )
}

function TextList({ values }: { values: { id: number; value?: string }[] }) {
  const filledValues = values.filter(({ value }) => !!value)
  if (filledValues.length === 0) {
    return null
  }

  return (
    <List>
      {filledValues.map(({ id, value }) => (
        <li key={id}>
          <Text>{value}</Text>
        </li>
      ))}
    </List>
  )
}

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
`

const ItemName = styled.div`
  font-weight: 700;
`

const Text = styled.div`
  white-space: pre-wrap;
`
