import { Bold } from '@components/style'
import { formatPhoneNumber } from '@features/ControlUnit/components/ControlUnitDialog/ControlUnitContactList/Item'
import { Link } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

type SourceProps = {
  email?: string
  name?: string
  phone?: string
}

export function PanelSource({ email, name, phone }: SourceProps) {
  return (
    <Container>
      {name && <Bold>{name}</Bold>}
      {phone && <Phone>{formatPhoneNumber(phone)}</Phone>}
      {email && (
        <Link href={`mailto:${email}`} rel="noreferrer" target="_blank">
          {email}
        </Link>
      )}
    </Container>
  )
}

const Phone = styled.span`
  color: ${$p => $p.theme.color.slateGray};
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
`
