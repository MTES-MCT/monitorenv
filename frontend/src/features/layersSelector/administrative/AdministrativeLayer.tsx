import { Icon, THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { hideAdministrativeLayer, showAdministrativeLayer } from '../../../domain/shared_slices/Administrative'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'

export function AdministrativeLayer({ isGrouped, layer }) {
  const dispatch = useAppDispatch()
  const { showedAdministrativeLayerIds } = useAppSelector(state => state.administrative)

  const isLayerVisible = showedAdministrativeLayerIds.includes(layer.code as number)

  const toggleLayer = () => {
    if (isLayerVisible) {
      dispatch(hideAdministrativeLayer(layer.code))
    } else {
      dispatch(showAdministrativeLayer(layer.code))
    }
  }

  return (
    <Row $isGrouped={isGrouped} data-cy="administrative-layer-toggle" onClick={toggleLayer}>
      <LayerName title={layer.name}>{layer.name}</LayerName>
      <Icon.Display color={isLayerVisible ? THEME.color.charcoal : THEME.color.lightGray} />
    </Row>
  )
}

const LayerName = styled.span`
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden;
  padding-top: 5px;
`

const Row = styled.span<{ $isGrouped: boolean }>`
  margin-top: 0px;
  padding: ${props => (props.$isGrouped ? '4px 16px 3px 20px' : '4px 16px 4px 20px')};
  padding-left: ${props => (props.$isGrouped ? '38px' : '20px')};
  line-height: 18px;
  display: flex;
  user-select: none;
  font-size: 13px;
  font-weight: 500;
  width: 100%;
  width: -moz-available;
  width: -webkit-fill-available;
  width: stretch;
  min-height: 36px;

  :hover {
    background: ${p => p.theme.color.blueYonder25};
  }
  & > :last-child {
    margin-left: auto;
    margin-top: 4px;
  }
`
