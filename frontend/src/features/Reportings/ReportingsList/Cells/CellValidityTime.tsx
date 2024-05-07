import { getTimeLeft } from '@features/Reportings/utils'
import { Icon, getLocalizedDayjs } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export function CellValidityTime({ row }) {
  const { createdAt, isArchived, validityTime } = row.original
  const endOfValidity = getLocalizedDayjs(createdAt).add(validityTime || 0, 'hour')
  const timeLeft = getTimeLeft(endOfValidity)

  const timeLeftText = () => {
    if (timeLeft < 0 || isArchived) {
      return '—'
    }

    if (timeLeft > 0 && timeLeft < 1) {
      return '< 1h'
    }

    return `${Math.round(timeLeft)} h`
  }

  return (
    <>
      <Icon.Clock />
      <Validity>{timeLeftText()}</Validity>
    </>
  )
}

const Validity = styled.span`
  vertical-align: top;
  padding-left: 4px;
`
