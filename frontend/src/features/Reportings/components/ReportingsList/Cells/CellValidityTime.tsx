import { getTimeLeft } from '@features/Reportings/utils'
import { Accent, customDayjs, Icon, Tag, THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export function CellValidityTime({ row }) {
  const { createdAt, isArchived, validityTime } = row.original
  const endOfValidity = customDayjs(createdAt).add(validityTime || 0, 'hour')
  const timeLeft = getTimeLeft(endOfValidity)

  if (timeLeft < 0 || isArchived) {
    return (
      <ArchivedTag accent={Accent.PRIMARY} Icon={Icon.Check} iconColor={THEME.color.slateGray}>
        Archivé
      </ArchivedTag>
    )
  }

  const timeLeftText = () => {
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

const ArchivedTag = styled(Tag)`
  color: ${p => p.theme.color.slateGray};
`
