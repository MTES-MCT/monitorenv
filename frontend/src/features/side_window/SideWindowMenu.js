import React from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'

import { sideWindowMenu, sideWindowPaths } from '../../domain/entities/sideWindow'
import { setSideWindowPath } from '../commonComponents/SideWindowRouter/SideWindowRouter.slice'

import { COLORS } from '../../constants/constants'
import { ReactComponent as MissionsSVG } from '../icons/Picto_resume.svg'

const SideWindowMenu = ({ selectedMenu }) => {
  const dispatch = useDispatch()

  return <Menu>
    <Link
      title={sideWindowMenu.MISSIONS.name}
      selected={selectedMenu === sideWindowMenu.MISSIONS.code}
      onClick={() => dispatch(setSideWindowPath(sideWindowPaths.MISSIONS))}
    >
      <MissionsIcon/>
    </Link>
  </Menu>
}

const Menu = styled.div`
  width: 66px;
  height: 100vh;
  background: ${COLORS.charcoal};
  flex-shrink: 0;
  font-size: 11px;
  color: ${COLORS.gainsboro};
  padding: 0;
`

const Link = styled.div`
  text-align: center;
  background: ${props => props.selected ? COLORS.shadowBlue : 'none'};
  padding: 7px 5px;
  height: 50px;
  cursor: pointer;
  border-bottom: 0.5px solid ${COLORS.slateGray};
`

const MissionsIcon = styled(MissionsSVG)`
  margin-top: 12px;
`

export default SideWindowMenu
