import styled from 'styled-components'

import { useAppSelector } from '../../hooks/useAppSelector'
import { ReactComponent as WarningSVG } from '../../uiMonitor/icons/Alert.svg'

export function Healthcheck() {
  const { healthcheckTextWarning } = useAppSelector(state => state.global)

  return (
    <>
      {healthcheckTextWarning ? (
        <HealthcheckWarnings>
          <Warning>
            <WarningIcon />
            {healthcheckTextWarning}
          </Warning>
        </HealthcheckWarnings>
      ) : null}
    </>
  )
}

const WarningIcon = styled(WarningSVG)`
  width: 20px;
  vertical-align: sub;
  margin-right: 8px;
  height: 18px;
`

const Warning = styled.div`
  font: normal normal bold 16px/22px Marianne;
`

const HealthcheckWarnings = styled.div`
  background: #f6d012 0% 0% no-repeat padding-box;
  width: 100%;
  height: 22px;
  text-align: center;
  padding: 13px;
  border-bottom: 2px solid #e3be05;
`
