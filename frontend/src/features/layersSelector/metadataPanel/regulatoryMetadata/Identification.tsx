import { displaySubTags } from '@utils/getTagsAsOptions'
import { displaySubThemes } from '@utils/getThemesAsOptions'

import { Body, Field, Fields, Key, NoValue, Value, Zone } from '../MetadataPanel.style'

import type { TagFromAPI } from 'domain/entities/tags'
import type { ThemeFromAPI } from 'domain/entities/themes'

export function Identification({
  facade,
  plan,
  polyName,
  resume,
  tags,
  themes,
  type
}: {
  facade: string
  plan: string
  polyName: string
  resume: string
  tags: TagFromAPI[]
  themes: ThemeFromAPI[]
  type: string
}) {
  const subThemes = displaySubThemes(themes)
  const subTags = displaySubTags(tags)

  return (
    <Zone>
      <Fields>
        <Body>
          {polyName.length > 0 && (
            <Field>
              <Key>Titre de la zone</Key>
              <Value data-cy="regulatory-layers-metadata-polyName">{polyName}</Value>
            </Field>
          )}
          <Field>
            <Key>Résumé</Key>
            <Value data-cy="regulatory-layers-metadata-resume">{resume || <NoValue>-</NoValue>}</Value>
          </Field>
          <Field>
            <Key>Ensemble reg.</Key>
            <Value data-cy="regulatory-layers-metadata-type">{type || <NoValue>-</NoValue>}</Value>
          </Field>
          <Field>
            <Key>Plan de contrôle</Key>
            <Value data-cy="regulatory-layers-metadata-plan">{plan || <NoValue>-</NoValue>}</Value>
          </Field>
          <Field>
            <Key>Thématiques</Key>
            <Value data-cy="regulatory-layers-metadata-theme">
              {themes.map(theme => theme.name).join(', ') || <NoValue>-</NoValue>}
            </Value>
          </Field>
          {subThemes && (
            <Field>
              <Key>Sous-thématiques</Key>
              <Value data-cy="regulatory-layers-metadata-subtheme">{subThemes}</Value>
            </Field>
          )}
          <Field>
            <Key>Tags</Key>
            <Value data-cy="regulatory-layers-metadata-tag">
              {tags.map(tag => tag.name).join(', ') || <NoValue>-</NoValue>}
            </Value>
          </Field>
          {subTags && (
            <Field>
              <Key>Sous-tags</Key>
              <Value data-cy="regulatory-layers-metadata-subtag">{subTags}</Value>
            </Field>
          )}
          <Field>
            <Key>Façade</Key>
            <Value data-cy="regulatory-layers-metadata-facade">{facade || <NoValue>-</NoValue>}</Value>
          </Field>
        </Body>
      </Fields>
    </Zone>
  )
}
