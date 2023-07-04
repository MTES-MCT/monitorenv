import _ from 'lodash'
import styled from 'styled-components'

import { RegulatoryLayerGroup } from './RegulatoryLayerGroup'
import { COLORS } from '../../../../constants/constants'

export function RegulatoryLayersList({ results }) {
  if (_.isEmpty(results)) {
    return (
      <List>
        <NoLayerSelected>Aucune zone sélectionnée</NoLayerSelected>
      </List>
    )
  }

  const layersByLayersName = _.groupBy(results, r => r?.properties?.layer_name)

  return (
    <List>
      {layersByLayersName &&
        Object.entries(layersByLayersName).map(([layerName, layers]) => (
          <RegulatoryLayerGroup key={layerName} groupName={layerName} layers={layers} />
        ))}
    </List>
  )
}

const NoLayerSelected = styled.div`
  color: ${COLORS.slateGray};
  margin: 10px;
  font-size: 13px;
`

const List = styled.ul`
  margin: 0;
  background: ${COLORS.background};
  border-radius: 0;
  padding: 0;
  max-height: 50vh;
  overflow-y: auto;
  overflow-x: hidden;
  color: ${COLORS.slateGray};
  transition: 0.5s all;
`
