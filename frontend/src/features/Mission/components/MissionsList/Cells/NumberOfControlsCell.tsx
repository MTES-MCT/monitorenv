import { UNKNOWN } from '@components/Table/TableWithSelectableRows/utils'
import { getTotalInfraction, getTotalOfControls } from '@features/Mission/utils'
import { THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export function NumberOfControlsCell({ envActions }) {
  const numberOfControls = getTotalOfControls(envActions)
  const totalInfractions = getTotalInfraction(envActions)

  return (
    <span>
      {totalInfractions > 0 && <StyledCircle $color={THEME.color.maximumRed} />}
      {numberOfControls > 0
        ? `${numberOfControls}${totalInfractions > 0 ? `(${totalInfractions} inf.)` : ''}`
        : UNKNOWN}
    </span>
  )
}

const StyledCircle = styled.div<{ $color: string }>`
  height: 10px;
  width: 10px;
  margin-right: 6px;
  background-color: ${p => p.$color};
  border-radius: 50%;
  display: inline-block;
`
