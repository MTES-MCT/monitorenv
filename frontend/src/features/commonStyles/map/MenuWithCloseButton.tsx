import { IconButton } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

const Container = styled.div`
  width: 320px;
  height: auto;
  max-height: 520px;
  margin-right: 6px;
  background-color: ${p => p.theme.color.white};
  box-shadow: 0px 3px 6px ${p => p.theme.color.slateGray};
`
const Header = styled.div`
  height: 40px;
  background-color: ${p => p.theme.color.charcoal};
  display: flex;
  justify-content: space-between;
  padding-right: 10px;
  padding-left: 10px;
  align-items: center;
`
const Title = styled.span`
  font-size: 16px;
  line-height: 22px;
  color: ${p => p.theme.color.white};
`
const Body = styled.div`
  height: calc(100% - 40px);
  overflow-y: auto;
  padding: 12px;
`

const VisibilityButton = styled(IconButton)`
  background: ${p => p.theme.color.gainsboro};
`
const CloseButton = styled(IconButton)`
  color: white;
`

// TODO delete padding when Monitor-ui component have good padding
const ButtonOnMap = styled(IconButton)`
  height: fit-content;
  padding: 6px;
`

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
`

export const MenuWithCloseButton = {
  Body,
  ButtonOnMap,
  CloseButton,
  Container,
  Footer,
  Header,
  Title,
  VisibilityButton
}
