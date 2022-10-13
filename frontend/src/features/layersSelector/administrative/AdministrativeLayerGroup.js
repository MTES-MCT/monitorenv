import React, { useState } from 'react'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'
import { ChevronIcon } from '../../commonStyles/icons/ChevronIcon.style'
import AdministrativeLayer from './AdministrativeLayer'

function AdministrativeLayerGroup({ isLastItem, layers }) {
  const [isOpen, setIsOpen] = useState(false)
  const toggleLayerGroup = () => setIsOpen(!isOpen)

  return (
    <>
      {layers && layers.length && layers[0] ? (
        <Row>
          <Zone isLastItem={isLastItem} isOpen={isOpen}>
            <Text onClick={toggleLayerGroup} title={layers[0].group.name.replace(/[_]/g, ' ')}>
              {layers[0].group.name.replace(/[_]/g, ' ')}
            </Text>
            <Chevron $isOpen={isOpen} onClick={toggleLayerGroup} />
          </Zone>
          <List isOpen={isOpen} length={layers.length} name={layers[0].group.name.replace(/\s/g, '-')}>
            {layers.map((layer, index) => (
              <AdministrativeLayer key={layer.code} isFirst={index === 0} isGrouped layer={layer} />
            ))}
          </List>
        </Row>
      ) : null}
    </>
  )
}

const Row = styled.div`
  width: 100%;
  display: block;
`

const Text = styled.span`
  padding-left: 20px;
  width: 100%;
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden;
  padding-bottom: 5px;
  padding-top: 8px;
  font-weight: 500;
  line-height: 20px;
  flex: content;
`

const Zone = styled.span`
  width: 100%;
  width: -moz-available;
  width: -webkit-fill-available;
  width: stretch;
  display: flex;
  user-select: none;
  padding-bottom: 2px;
  ${props => (!props.isOpen ? null : `border-bottom: 1px solid ${COLORS.lightGray};`)}

  :hover {
    background: ${COLORS.shadowBlueLittleOpacity};
  }
`

const List = styled.div`
  height: ${props => (props.isOpen && props.length ? props.length * 34 + 10 : 0)}px;
  overflow: hidden;
  transition: 0.2s all;
`

const Chevron = styled(ChevronIcon)`
  margin-top: 5px;
`

export default AdministrativeLayerGroup
