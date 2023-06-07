import _ from 'lodash'
import { useMemo } from 'react'
import styled from 'styled-components'

import { useGetAMPsQuery } from '../../../api/ampsAPI'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { AMPLayerGroup } from './AMPLayerGroup'

export function AmpLayersList() {
  const { selectedAmpLayerIds, showedAmpLayerIds } = useAppSelector(state => state.selectedAmp)
  const { currentData: amps } = useGetAMPsQuery()
  const selectedAmps = useMemo(() => selectedAmpLayerIds.map(id => amps?.entities?.[id]), [amps, selectedAmpLayerIds])
  const layersByLayersName = useMemo(() => _.groupBy(selectedAmps, r => r?.name), [selectedAmps])

  if (_.isEmpty(selectedAmpLayerIds)) {
    return (
      <List>
        <NoLayerSelected>Aucune zone sélectionnée</NoLayerSelected>
      </List>
    )
  }

  return (
    <List>
      {layersByLayersName &&
        Object.entries(layersByLayersName).map(([layerName, layers]) => (
          <AMPLayerGroup key={layerName} groupName={layerName} layers={layers} showedAmpLayerIds={showedAmpLayerIds} />
        ))}
    </List>
  )
}

const NoLayerSelected = styled.div`
  color: ${p => p.theme.color.slateGray};
  margin: 10px;
  font-size: 13px;
`

const List = styled.ul`
  margin: 0;
  background: ${p => p.theme.color.white};
  border-radius: 0;
  padding: 0;
  max-height: 50vh;
  overflow-y: auto;
  overflow-x: hidden;
  color: ${p => p.theme.color.slateGray};
  transition: 0.5s all;
`
