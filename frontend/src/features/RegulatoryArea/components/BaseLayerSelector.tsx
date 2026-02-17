import { useAppDispatch } from '@hooks/useAppDispatch'
import { Dropdown, Icon } from '@mtes-mct/monitor-ui'
import { BaseLayer, BaseLayerLabel } from 'domain/entities/layers/BaseLayer'
import styled from 'styled-components'

import { regulatoryAreaBoActions } from '../slice'

export function BaseLayerSelector() {
  const dispatch = useAppDispatch()

  const updateBaseLayer = (layercode: string) => {
    dispatch(regulatoryAreaBoActions.selectBaseLayer(layercode))
  }

  return (
    <StyledDropdown Icon={Icon.Chevron} placement="topEnd" title="Fond de carte">
      <Dropdown.Item onClick={() => updateBaseLayer(BaseLayer.LIGHT)}>{BaseLayerLabel.LIGHT}</Dropdown.Item>
      <Dropdown.Item onClick={() => updateBaseLayer(BaseLayer.OSM)}>{BaseLayerLabel.OSM}</Dropdown.Item>
      <Dropdown.Item onClick={() => updateBaseLayer(BaseLayer.SATELLITE)}>{BaseLayerLabel.SATELLITE}</Dropdown.Item>
      <Dropdown.Item onClick={() => updateBaseLayer(BaseLayer.SHOM)}>{BaseLayerLabel.SHOM}</Dropdown.Item>
    </StyledDropdown>
  )
}

const StyledDropdown = styled(Dropdown)`
  bottom: 10px;
  position: absolute;
  right: 12px;
`
