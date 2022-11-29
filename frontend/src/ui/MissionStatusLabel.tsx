import styled from 'styled-components'

import { COLORS } from '../constants/constants'
import { missionStatusEnum } from '../domain/entities/missions'
import { ReactComponent as CercleSVG } from '../uiMonitor/icons/Cercle.svg'
import { ReactComponent as CheckSVG } from '../uiMonitor/icons/Check.svg'

export function MissionStatusLabel({ missionStatus }) {
  switch (missionStatus) {
    case missionStatusEnum.PENDING.code:
      return (
        <Pending>
          <CercleIcon />
          {missionStatusEnum.PENDING.libelle}
        </Pending>
      )
    case missionStatusEnum.ENDED.code:
      return (
        <Ended>
          <CercleIcon />
          {missionStatusEnum.ENDED.libelle}
        </Ended>
      )

    case missionStatusEnum.CLOSED.code:
      return (
        <Closed>
          <CheckIcon />
          {missionStatusEnum.CLOSED.libelle}
        </Closed>
      )
    case missionStatusEnum.UPCOMING.code:
      return (
        <Upcoming>
          <CercleIcon />
          {missionStatusEnum.UPCOMING.libelle}
        </Upcoming>
      )

    default:
      return <Closed>No status</Closed>
  }
}

const CercleIcon = styled(CercleSVG)``
const CheckIcon = styled(CheckSVG)``

const Pending = styled.div`
  color: ${COLORS.mediumSeaGreen};
  font-weight: 500;
  svg {
    margin-right: 6px;
  }
`

const Ended = styled.div`
  color: ${COLORS.charcoal};
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

const Upcoming = styled.div`
  color: ${COLORS.blueGray};
  font-weight: 500;
  svg {
    margin-right: 6px;
  }
`
