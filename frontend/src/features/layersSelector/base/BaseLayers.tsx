import { useDispatch } from 'react-redux'
import { RadioGroup } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'
import { baseLayers } from '../../../domain/entities/layers'
import { toggleBaseLayer } from '../../../domain/shared_slices/LayerSidebar'
import { selectBaseLayer } from '../../../domain/shared_slices/Map'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { ChevronIcon } from '../../commonStyles/icons/ChevronIcon.style'
import BaseLayerItem from './BaseLayerItem'

const baseLayersKeys = Object.keys(baseLayers).filter(key => key !== baseLayers.DARK.code)

export function BaseLayers() {
  const dispatch = useDispatch()
  const { baselayerIsOpen } = useAppSelector(state => state.layerSidebar)
  const { selectedBaseLayer } = useAppSelector(state => state.map)
  const onSectionTitleClicked = () => {
    dispatch(toggleBaseLayer())
  }
  const handleSelectBaseLayer = layercode => {
    dispatch(selectBaseLayer(layercode))
  }

  return (
    <>
      <SectionTitle $showBaseLayers={baselayerIsOpen} onClick={onSectionTitleClicked}>
        Fonds de carte <ChevronIcon $isOpen={baselayerIsOpen} $right />
      </SectionTitle>
      <RadioGroup onChange={handleSelectBaseLayer} value={selectedBaseLayer}>
        <BaseLayersList $baseLayersLength={baseLayersKeys.length} $showBaseLayers={baselayerIsOpen}>
          {baseLayersKeys.map(layer => (
            <ListItem key={layer}>
              <BaseLayerItem layer={layer} />
            </ListItem>
          ))}
        </BaseLayersList>
      </RadioGroup>
    </>
  )
}

const SectionTitle = styled.div<{ $showBaseLayers: boolean }>`
  height: 38px;
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  background: ${COLORS.charcoal};
  color: ${COLORS.gainsboro};
  font-size: 16px;
  padding-top: 5px;
  cursor: pointer;
  text-align: left;
  padding-left: 20px;
  user-select: none;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  border-bottom-left-radius: ${p => (p.$showBaseLayers ? '0' : '2px')};
  border-bottom-right-radius: ${p => (p.$showBaseLayers ? '0' : '2px')};
`

const BaseLayersList = styled.ul<{ $baseLayersLength: number | undefined; $showBaseLayers: boolean }>`
  margin: 0;
  border-radius: 0;
  padding: 0;
  height: 0;
  overflow-y: hidden;
  overflow-x: hidden;
  background: ${COLORS.background};

  animation: ${p => (p.$showBaseLayers ? 'zones-opening' : 'zones-closing')} 0.5s ease forwards;

  @keyframes zones-opening {
    0% {
      height: 0;
    }
    100% {
      height: ${p => (p.$baseLayersLength ? `${38 * p.$baseLayersLength}px` : '175px')};
    }
  }

  @keyframes zones-closing {
    0% {
      height: ${p => (p.$baseLayersLength ? `${38 * p.$baseLayersLength}px` : '175px')};
    }
    100% {
      height: 0;
    }
  }

  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
`

const ListItem = styled.li`
  margin: 0;
  text-align: left;
  list-style-type: none;
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden !important;
  cursor: pointer;
  background: ${COLORS.background};
  color: ${COLORS.gunMetal};
  border-bottom: 1px solid ${COLORS.lightGray};
  line-height: 1.9em;

  :hover {
    background: ${COLORS.blueYonder25};
  }
`
