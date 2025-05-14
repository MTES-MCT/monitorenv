import { Body, Field, Fields, Key, NoValue, Value, Zone } from '../MetadataPanel.style'

import type { TagFromAPI } from 'domain/entities/tags'
import type { ThemeFromAPI } from 'domain/entities/themes'

export function Identification({
  entityName,
  facade,
  tags,
  themes,
  type
}: {
  entityName: string
  facade: string
  tags: TagFromAPI[]
  themes: ThemeFromAPI[]
  type: string
}) {
  return (
    <Zone>
      <Fields>
        <Body>
          <Field>
            <Key>Entité</Key>
            <Value data-cy="regulatory-layers-metadata-entityName">{entityName || <NoValue>-</NoValue>}</Value>
          </Field>
          <Field>
            <Key>Ensemble reg.</Key>
            <Value data-cy="regulatory-layers-metadata-type">{type || <NoValue>-</NoValue>}</Value>
          </Field>
          <Field>
            <Key>Thématiques</Key>
            <Value data-cy="regulatory-layers-metadata-theme">
              {themes.map(theme => theme.name).join(', ') || <NoValue>-</NoValue>}
            </Value>
          </Field>
          <Field>
            <Key>Sous-thématiques</Key>
            <Value data-cy="regulatory-layers-metadata-subtheme">
              {themes.flatMap(theme => theme.subThemes.map(subTheme => subTheme.name)).join(', ') || (
                <NoValue>-</NoValue>
              )}
            </Value>
          </Field>
          <Field>
            <Key>Tags</Key>
            <Value data-cy="regulatory-layers-metadata-tag">
              {tags.map(tag => tag.name).join(', ') || <NoValue>-</NoValue>}
            </Value>
          </Field>
          <Field>
            <Key>Sous-tags</Key>
            <Value data-cy="regulatory-layers-metadata-subtag">
              {tags.flatMap(tag => tag.subTags.map(subTag => subTag.name)).join(', ') || <NoValue>-</NoValue>}
            </Value>
          </Field>
          <Field>
            <Key>Façade</Key>
            <Value data-cy="regulatory-layers-metadata-facade">{facade || <NoValue>-</NoValue>}</Value>
          </Field>
        </Body>
      </Fields>
    </Zone>
  )
}
