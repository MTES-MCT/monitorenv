import { InlineTransparentButton } from '@components/style'
import { Accent, Icon, IconButton, THEME } from '@mtes-mct/monitor-ui'
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
    <Wrapper $isGrouped={isGrouped}>
      <Row data-cy="administrative-layer-toggle" onClick={toggleLayer}>
        <LayerName title={layer.name}>{layer.name}</LayerName>
      </Row>
      <IconButton
        accent={Accent.TERTIARY}
        color={isLayerVisible ? THEME.color.charcoal : THEME.color.lightGray}
        Icon={Icon.Display}
        onClick={toggleLayer}
        title={isLayerVisible ? 'Afficher la zone' : 'Masquer la zone'}
      />
    </Wrapper>
  )
}

const LayerName = styled.span`
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden;
  padding-top: 5px;
`

const Row = styled(InlineTransparentButton)`
  display: flex;
  user-select: none;
  font-weight: 500;
`

const Wrapper = styled.div<{ $isGrouped: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  padding: ${props => (props.$isGrouped ? '5px 16px 6px 20px' : '6px 16px 6px 20px')};
  padding-left: ${props => (props.$isGrouped ? '38px' : '20px')};

  &:hover {
    background: ${p => p.theme.color.blueYonder25};
  }
`
