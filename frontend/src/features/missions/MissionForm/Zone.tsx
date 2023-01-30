import { IconButton } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'
import { ReactComponent as DeleteSVG } from '../../../uiMonitor/icons/Delete.svg'
import { ReactComponent as LocalizeIconSVG } from '../../../uiMonitor/icons/Focus.svg'

import type { MouseEventHandler } from 'react'

export function Zone({
  className,
  handleCenterOnMap,
  handleDelete,
  name
}: {
  className?: string
  handleCenterOnMap: MouseEventHandler
  handleDelete: Function
  name: string
}) {
  return (
    <ZoneWrapper className={className}>
      <ZoneDetail>
        {name}
        <CenterOnMap onClick={handleCenterOnMap}>
          <LocalizeIcon />
          Centrer sur la carte
        </CenterOnMap>
      </ZoneDetail>
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

const ZoneDetail = styled.div`
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
  vertical-align: text-bottom;
  font-size: 12px;
`
