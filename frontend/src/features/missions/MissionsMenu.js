import React from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'

import { closeSideWindow, openSideWindowTab } from '../../domain/shared_slices/Global'
import { sideWindowMenu } from '../../domain/entities/sideWindow'

import { ReactComponent as MissionsSVG } from '../icons/Picto_resume.svg'
import { MapButtonStyle } from '../commonStyles/MapButton.style'
import { COLORS } from '../../constants/constants'

export const MissionsMenu = () => {
  const dispatch = useDispatch()
  const {
    healthcheckTextWarning,
    previewFilteredVesselsMode,
    openedSideWindowTab,
    sideWindowIsOpen
  } = useSelector(state => state.global)

  const toggleMissionsWindow = () => {
    if (!sideWindowIsOpen || (sideWindowIsOpen && openedSideWindowTab !== sideWindowMenu.ALERTS.code)) {
      dispatch(openSideWindowTab(sideWindowMenu.ALERTS.code))
      return
    }

    if (sideWindowIsOpen && openedSideWindowTab === sideWindowMenu.ALERTS.code) {
      dispatch(closeSideWindow())
    }
  }

  return (
    <MissionsButton
      data-cy={'missions-button'}
      title={'Alertes'}
      isVisible={openedSideWindowTab === sideWindowMenu.ALERTS.code}
      healthcheckTextWarning={healthcheckTextWarning}
      isHidden={previewFilteredVesselsMode}
      onClick={toggleMissionsWindow}
    >
      <AlertsIcon/>
    </MissionsButton>
  )
}

const MissionsButton = styled(MapButtonStyle)`
  position: absolute;
  display: inline-block;
  color: ${COLORS.blue};
  background: ${props => props.isVisible ? COLORS.shadowBlue : COLORS.charcoal};
  padding: 2px 2px 2px 2px;
  top: 65px;
  right: 12px;
  border-radius: 2px;
  height: 40px;
  width: 40px;

  :hover, :focus {
      background: ${props => props.isVisible ? COLORS.shadowBlue : COLORS.charcoal};
  }
`

const AlertsIcon = styled(MissionsSVG)`
  margin-top: 5px;
  width: 20px;
`
