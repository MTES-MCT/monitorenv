import React from 'react'
import styled from 'styled-components'

import { COLORS } from '../../../../constants/constants'
import { Key, Value, Fields, Field } from './RegulatoryMetadata.style'

const Identification = ({thematique, type, facade, entity_name}) => {
  
  return <Zone>
    <Fields>
      <Body>
        <Field>
          <Key>Entité</Key>
          <Value data-cy={'regulatory-layers-metadata-lawtype'}>
            {entity_name || <NoValue>-</NoValue>}
          </Value>
        </Field>
        <Field>
          <Key>Ensemble reg.</Key>
          <Value data-cy={'regulatory-layers-metadata-lawtype'}>
            {type || <NoValue>-</NoValue>}
          </Value>
        </Field>
        <Field>
          <Key>Thématique</Key>
          <Value data-cy={'regulatory-layers-metadata-topic'}>
            {thematique || <NoValue>-</NoValue>}
          </Value>
        </Field>
        <Field>
          <Key>Façade</Key>
          <Value data-cy={'regulatory-layers-metadata-region'}>
            {facade || <NoValue>-</NoValue>}
          </Value>
        </Field>
      </Body>
    </Fields>
  </Zone>
}

const NoValue = styled.span`
  color: ${COLORS.slateGray};
  font-weight: 300;
  line-height: normal;
  font-size: 13px;
  display: block;
`

const Body = styled.tbody``

const Zone = styled.div`
  margin: 0;
  padding: 10px 5px 9px 16px;
  text-align: left;
  display: flex;
  flex-wrap: wrap;
  border-bottom: 1px solid ${COLORS.lightGray};
`

export default Identification
