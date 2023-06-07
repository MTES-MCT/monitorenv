import _ from 'lodash'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { toggleMyAmps } from '../../../domain/shared_slices/LayerSidebar'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { ReactComponent as PinSVG } from '../../../uiMonitor/icons/Pin.svg'
import { ChevronIcon } from '../../commonStyles/icons/ChevronIcon.style'
import { AmpLayersList } from './AmpLayersList'

export function AmpLayers() {
  const dispatch = useDispatch()
  const { selectedAmpLayerIds } = useAppSelector(state => state.selectedAmp)
  const { myAmpsIsOpen } = useAppSelector(state => state.layerSidebar)
  const onTitleClicked = () => {
    dispatch(toggleMyAmps())
  }

  return (
    <>
      <AmpLayersTitle $showAmpLayers={myAmpsIsOpen} data-cy="regulatory-layers-my-zones" onClick={onTitleClicked}>
        <PinSVGIcon />
        <Title>Mes AMP</Title>
        <ChevronIcon $isOpen={myAmpsIsOpen} $right />
      </AmpLayersTitle>
      {myAmpsIsOpen && (
        <List>
          {_.isEmpty(selectedAmpLayerIds) ? (
            <NoLayerSelected>Aucune zone sélectionnée</NoLayerSelected>
          ) : (
            <AmpLayersList />
          )}
        </List>
      )}
    </>
  )
}

const PinSVGIcon = styled(PinSVG)`
  width: 18px;
  height: 18px;
  margin-top: 2px;
  margin-right: 8px;
`
const Title = styled.span`
  font-size: 16px;
  line-height: 22px;
`

const AmpLayersTitle = styled.div<{ $showAmpLayers: boolean }>`
  height: 38px;
  padding-top: 8px;
  padding-left: 16px;
  color: ${p => p.theme.color.gainsboro};
  display: flex;
  cursor: pointer;
  text-align: left;
  user-select: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  border-bottom-left-radius: ${props => (props.$showAmpLayers ? '0' : '2px')};
  border-bottom-right-radius: ${props => (props.$showAmpLayers ? '0' : '2px')};
  background: ${p => p.theme.color.charcoal};
`

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
