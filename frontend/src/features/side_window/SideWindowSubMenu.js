import React from 'react'
import styled from 'styled-components'
import { COLORS } from '../../constants/constants'
import SideWindowSubMenuLink from './SideWindowSubMenuLink'

/**
 * This component use JSON styles and not styled-components ones so the new window can load the styles not in a lazy way
 * @param selectedMenu
 * @param selectedSubMenu
 * @param setSelectedSubMenu
 * @param beaconStatuses
 * @param alerts
 * @return {JSX.Element}
 * @constructor
 */
const SideWindowSubMenu = ({ selectedMenu, selectedSubMenu, setSelectedSubMenu, alerts }) => {
  console.log(selectedMenu, alerts, selectedSubMenu)
  return <Menu style={menuStyle}>
    <Title style={titleStyle}>
      Vue d&apos;ensemble
    </Title>
      <>
        <SideWindowSubMenuLink
          number={12}
          menu={'menu here'}
          isSelected={true}
          setSelected={setSelectedSubMenu}
        />
      </>
  </Menu>
}

const Menu = styled.div``
const menuStyle = {
  width: 200,
  height: '100vh',
  background: COLORS.gainsboro,
  flexShrink: 0,
  fontSize: 16,
  fontWeight: 500,
  color: COLORS.slateGray,
  padding: '14px 0'
}

const Title = styled.span``
const titleStyle = {
  width: 180,
  display: 'inline-block',
  paddingBottom: 11,
  paddingLeft: 20,
  borderBottom: `1px solid ${COLORS.lightGray}`
}

export default SideWindowSubMenu
