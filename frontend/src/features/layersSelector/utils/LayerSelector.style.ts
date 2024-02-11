import styled from 'styled-components'

export const LAYER_SELECTOR_ROW_HEIGHT = 36

const IconGroup = styled.span`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex: 0;
`

const Layer = styled.span<{ $metadataIsShown?: boolean; $selected?: boolean }>`
  user-select: none;
  display: flex;
  text-align: left;
  font-size: 13px;
  padding-left: 20px;
  background: ${p => (p.$metadataIsShown || p.$selected ? p.theme.color.blueYonder25 : 'transparent')};
  color: ${p => p.theme.color.gunMetal};
  height: ${LAYER_SELECTOR_ROW_HEIGHT}px;
  align-items: center;

  &:hover {
    background: ${p => p.theme.color.blueYonder25};
  }
`

const Name = styled.span`
  width: 280px;
  display: block;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden !important;
  font-size: inherit;
  text-align: left;
  span {
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const ZonesNumber = styled.span`
  font-size: 13px;
  color: ${p => p.theme.color.slateGray};
  margin-left: auto;
  margin-right: 8px;
  line-height: 34px;
  font-weight: 400;
  flex: 1;
  max-width: 50px;
`

const GroupWrapper = styled.li<{ $isPadded?: boolean }>`
  display: flex;
  align-items: center;
  user-select: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden !important;
  height: ${LAYER_SELECTOR_ROW_HEIGHT}px;
  font-size: 13px;
  padding-left: 18px;
  padding-right: ${p => (p.$isPadded ? '11px' : '0')};
  font-weight: 700;
  color: ${p => p.theme.color.gunMetal};
  border-bottom: 1px solid ${p => p.theme.color.lightGray};

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
  max-width: 300px;
  line-height: 33px;
  flex: 1;
  padding-right: 8px;
`

const GroupList = styled.li<{ isOpen: boolean; length: number }>`
  height: ${p => (p.isOpen && p.length ? p.length * LAYER_SELECTOR_ROW_HEIGHT : 0)}px;
  overflow: hidden;
  transition: 0.5s all;
  border-bottom: ${p => (p.isOpen ? 1 : 0)}px solid ${p => p.theme.color.lightGray};
`

const SubGroup = styled.div<{ isOpen: boolean; length: number }>`
  height: ${props => (props.isOpen && props.length ? props.length * LAYER_SELECTOR_ROW_HEIGHT : 0)}px;
  overflow: hidden;
  transition: 0.5s all;
  border-bottom: ${p => (p.isOpen ? 1 : 0)}px solid ${p => p.theme.color.lightGray};
`

const LayerList = styled.ul`
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

const NoLayerSelected = styled.div`
  color: ${p => p.theme.color.slateGray};
  padding: 6px;
  font-size: 13px;
  height: 36px;
  text-align: center;
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
  SubGroup,
  ZonesNumber
}
