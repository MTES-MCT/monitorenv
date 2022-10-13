import React from 'react'
import { IconButton } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'
import { ReactComponent as LocalizeIconSVG } from '../../../uiMonitor/icons/centrer.svg'
import { ReactComponent as DeleteSVG } from '../../../uiMonitor/icons/Suppression_clair.svg'

export function MissionZone({ handleCenterOnMap, handleDelete, name }) {
  return (
    <ZoneWrapper>
      <Zone>
        {name}
        <CenterOnMap onClick={handleCenterOnMap}>
          <LocalizeIcon />
          Centrer sur la carte
        </CenterOnMap>
      </Zone>
      <PaddedIconButton appearance="ghost" icon={<DeleteSVG className="rs-icon" />} onClick={handleDelete} />
    </ZoneWrapper>
  )
}

const ZoneWrapper = styled.div`
  display: flex;
  max-width: 484px;
  margin-bottom: 4px;
`

const PaddedIconButton = styled(IconButton)`
  margin-left: 4px;
`

const Zone = styled.div`
  width: 419px;
  line-height: 30px;
  padding-left: 12px;
  padding-right: 8px;
  background: ${COLORS.gainsboro};
  font: normal normal medium 13px/18px Marianne;
  color: ${COLORS.gunMetal};
  display: flex;
`
const CenterOnMap = styled.div`
  cursor: pointer;
  margin-left: auto;
  color: ${COLORS.slateGray};
  text-decoration: underline;
`
const LocalizeIcon = styled(LocalizeIconSVG)`
  margin-right: 8px;
  font-size: 12px;
`
