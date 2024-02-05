import { Icon } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { useAppSelector } from '../../hooks/useAppSelector'

export function Healthcheck() {
  const { healthcheckTextWarning } = useAppSelector(state => state.global)

  return (
    <>
      {healthcheckTextWarning ? (
        <HealthcheckWarnings>
          <Icon.Alert />
          {healthcheckTextWarning}
        </HealthcheckWarnings>
      ) : null}
    </>
  )
}

const HealthcheckWarnings = styled.div`
  align-items: center;
  background-color: ${p => p.theme.color.goldenPoppy};
  border-bottom: 2px solid #e3be05;
  display: flex;
  font: normal normal bold 16px/22px Marianne;
  gap: 8px;
  justify-content: center;
  padding: 13px;
`
