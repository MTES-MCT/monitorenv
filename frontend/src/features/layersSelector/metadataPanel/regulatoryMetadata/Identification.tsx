import { Body, Key, Value, Fields, Field, Zone, NoValue } from '../MetadataPanel.style'

export function Identification({ entityName, facade, thematique, type }) {
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
            <Value data-cy="regulatory-layers-metadata-topic">{thematique || <NoValue>-</NoValue>}</Value>
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
