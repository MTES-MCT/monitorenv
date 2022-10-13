import styled, { css } from 'styled-components'

import { ReactComponent as REGPaperSVG } from '../../../uiMonitor/icons/reg_paper.svg'
import { ReactComponent as REGPaperDarkSVG } from '../../../uiMonitor/icons/reg_paper_dark.svg'

const baseREGPaperIcon = css`
  width: 20px;
  flex-shrink: 0;
  height: 20px;
  align-self: center;
  margin-right: 7px;
`
export const REGPaperIcon = styled(REGPaperSVG)`
  ${baseREGPaperIcon}
`

export const REGPaperDarkIcon = styled(REGPaperDarkSVG)`
  ${baseREGPaperIcon}
`
