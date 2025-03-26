import { Body, Field, Fields, Key, NoValue, Value, Zone } from '../MetadataPanel.style'

import type { TagAPI } from 'domain/entities/tags'

export function Identification({
  entityName,
  facade,
  tags,
  type
}: {
  entityName: string
  facade: string
  tags: TagAPI[]
  type: string
}) {
  return (
    <Zone>
      <Fields>
        <Body>
          <Field>
            <Key>Entité</Key>
            <Value data-cy="regulatory-layers-metadata-lawtype">{entityName || <NoValue>-</NoValue>}</Value>
          </Field>
          <Field>
            <Key>Ensemble reg.</Key>
            <Value data-cy="regulatory-layers-metadata-lawtype">{type || <NoValue>-</NoValue>}</Value>
          </Field>
          <Field>
            <Key>Thématique</Key>
            <Value data-cy="regulatory-layers-metadata-topic">
              {tags.map(theme => theme.name).join(', ') || <NoValue>-</NoValue>}
            </Value>
          </Field>
          <Field>
            <Key>Façade</Key>
            <Value data-cy="regulatory-layers-metadata-region">{facade || <NoValue>-</NoValue>}</Value>
          </Field>
        </Body>
      </Fields>
    </Zone>
  )
}
