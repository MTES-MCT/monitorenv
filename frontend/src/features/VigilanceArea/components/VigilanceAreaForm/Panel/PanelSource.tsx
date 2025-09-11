import { Bold } from '@components/style'
import { formatPhoneNumber } from '@features/ControlUnit/components/ControlUnitDialog/ControlUnitContactList/Item'
import { Link, Tag, THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

type SourceProps = {
  comments?: string
  email?: string
  isAnonymous?: boolean | undefined
  isReadOnly?: boolean
  link?: string
  name?: string
  phone?: string
}

export function PanelSource({ comments, email, isAnonymous, isReadOnly = false, link, name, phone }: SourceProps) {
  return (
    <Container>
      {name && (
        <NameContainer>
          <Bold>{name}</Bold>
          {isAnonymous && <Tag backgroundColor={isReadOnly ? THEME.color.gainsboro : THEME.color.white}>Anonyme</Tag>}
        </NameContainer>
      )}
      {phone && <Text>{formatPhoneNumber(phone)}</Text>}
      {email && (
        <Link href={`mailto:${email}`} rel="noreferrer" target="_blank">
          {email}
        </Link>
      )}
      {link && (
        <Link href={link} rel="noreferrer" target="_blank">
          {link}
        </Link>
      )}
      {comments && <Text>{comments}</Text>}
    </Container>
  )
}

const Text = styled.span`
  color: ${$p => $p.theme.color.slateGray};
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
`
const NameContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 6px;
`
