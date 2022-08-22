import React from 'react'
import styled from 'styled-components'


import { missionStatusEnum } from '../domain/entities/missions'
import { ReactComponent as CercleSVG } from '../uiMonitor/icons/cercle.svg'
import { ReactComponent as CheckSVG } from '../uiMonitor/icons/check.svg'
import { COLORS } from '../constants/constants'


export const MissionStatusLabel = ({missionStatus}) => {
  switch (missionStatus) {
    case missionStatusEnum.PENDING.code:
      return (
          <Pending>
            <CercleIcon/>
            { missionStatusEnum.PENDING.libelle}
          </Pending>);
    case missionStatusEnum.ENDED.code:
      return (
        <Ended>
            <CercleIcon/>
            { missionStatusEnum.ENDED.libelle}
          </Ended>);

    case missionStatusEnum.CLOSED.code:
      return (
          <Closed>
            <CheckIcon/>
            { missionStatusEnum.CLOSED.libelle}
          </Closed>);
  
    default:
      return <Closed>No status</Closed>
  }
}

const CercleIcon = styled(CercleSVG)``
const CheckIcon = styled(CheckSVG)``

const Pending = styled.div`
  color:${COLORS.mediumSeaGreen};
  font-weight: 500;
  svg {
    margin-right: 6px;
  }
`

const Ended = styled.div`
  color:${COLORS.charcoal};
  font-weight: 500;
  svg {
    margin-right: 6px;
  }
`

const Closed = styled.div`
  color: ${COLORS.opal};
  font-weight: 500;
  svg {
    margin-right: 6px;
  }
`