import { Icon } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export const LAYER_SELECTOR_ROW_HEIGHT = 36

const IconGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: stretch;
`

const Layer = styled.li<{ $metadataIsShown?: boolean; $withBorderBottom?: boolean }>`
  align-items: center;
  background: ${p => (p.$metadataIsShown ? p.theme.color.blueYonder25 : 'transparent')};
  border-bottom: ${p => (p.$withBorderBottom ? 1 : 0)}px solid ${p => p.theme.color.lightGray};
  color: ${p => p.theme.color.gunMetal};
  display: flex;
  font-size: 13px;
  height: ${LAYER_SELECTOR_ROW_HEIGHT}px;
  padding-left: 18px;
  text-align: left;
  user-select: none;
  justify-content: space-between;

  &:hover {
    background: ${p => p.theme.color.blueYonder25};
  }
`

const Name = styled.span`
  display: block;
  margin-left: 8px;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const ZonesNumber = styled.span`
  font-size: 13px;
  color: ${p => p.theme.color.slateGray};
  margin-left: auto;
  margin-right: 8px;
  line-height: 34px;
  font-weight: 400;
  max-width: 50px;
`

const GroupWrapper = styled.div<{ $isOpen: boolean; $isPadded?: boolean }>`
  align-items: center;
  border-bottom: ${p => (p.$isOpen ? 0 : 1)}px solid ${p => p.theme.color.lightGray};
  color: ${p => p.theme.color.gunMetal};
  display: flex;
  font-size: 13px;
  font-weight: 700;
  height: ${LAYER_SELECTOR_ROW_HEIGHT}px;
  justify-content: space-between;
  overflow: hidden !important;
  padding-left: 18px;
  padding-right: ${p => (p.$isPadded ? '8px' : '0')};
  text-overflow: ellipsis;
  user-select: none;
  white-space: nowrap;

  &:hover {
    background: ${p => p.theme.color.blueYonder25};
  }

  .rs-checkbox-checker {
    padding-top: 24px;
  }

  .rs-checkbox {
    margin-left: 0;
  }
`

const GroupName = styled.span`
  user-select: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden !important;
  display: block;
  font-size: 13px;
  font-weight: 700;
  text-align: left;
  color: ${p => p.theme.color.gunMetal};
  line-height: 33px;
  flex: 1;
  padding-right: 8px;
`

const GroupList = styled.ul<{ $isOpen: boolean; $length: number }>`
  height: ${p => (p.$isOpen && p.$length ? p.$length * LAYER_SELECTOR_ROW_HEIGHT : 0)}px;
  overflow: hidden;
  transition: 0.5s all;
  border-bottom: ${p => (p.$isOpen ? 1 : 0)}px solid ${p => p.theme.color.lightGray};
`

const SubGroup = styled.ul<{ $isOpen: boolean; $length: number }>`
  height: ${props => (props.$isOpen && props.$length ? props.$length * LAYER_SELECTOR_ROW_HEIGHT : 0)}px;
  overflow: hidden;
  transition: 0.5s all;
  border-bottom: ${p => (p.$isOpen ? 1 : 0)}px solid ${p => p.theme.color.lightGray};
`

const LayerList = styled.ul<{ $baseLayersLength: number; $maxHeight?: number; $showBaseLayers: boolean }>`
  margin: 0;
  background: ${p => p.theme.color.white};
  border-radius: 0;
  padding: 0;
  max-height: ${p => p.$maxHeight ?? 50}vh;
  overflow-y: auto;
  overflow-x: hidden;
  color: ${p => p.theme.color.slateGray};
  height: ${p => (p.$showBaseLayers && p.$baseLayersLength ? 36 * p.$baseLayersLength : 0)}px;
  transition: 0.5s all;
`

const NoLayerSelected = styled.li`
  background: ${p => p.theme.color.white};
  color: ${p => p.theme.color.slateGray};
  padding: 16px 8px 16px;
  text-align: center;
`

const NumberOfZones = styled.span`
  color: ${p => p.theme.color.slateGray};
  font-weight: 400;
  padding-right: 3px;
`

const Wrapper = styled.div<{ $hasPinnedLayers?: boolean; $isExpanded: boolean }>`
  height: 38px;
  font-size: 16px;
  line-height: 22px;
  padding: 6px 4px 0 16px;
  color: ${p => p.theme.color.gainsboro};
  display: flex;
  cursor: pointer;
  text-align: left;
  user-select: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  background: ${p => p.theme.color.charcoal};

  ${props => props.$hasPinnedLayers && `.Element-IconBox:first-of-type svg { color: ${props.theme.color.blueGray}; }`}
`
const Title = styled.span`
  flex: 1;
`

const Pin = styled(Icon.Pin)`
  margin-right: 8px;
  margin-top: 2px;
`

export const LayerSelector = {
  GroupList,
  GroupName,
  GroupWrapper,
  IconGroup,
  Layer,
  LayerList,
  Name,
  NoLayerSelected,
  NumberOfZones,
  Pin,
  SubGroup,
  Title,
  Wrapper,
  ZonesNumber
}
