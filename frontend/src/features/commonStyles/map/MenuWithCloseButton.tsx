import { IconButton } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

const Container = styled.div`
  width: 319px;
  margin-right: 6px;
  background-color: ${p => p.theme.color.white};
  box-shadow: 0px 3px 6px ${p => p.theme.color.slateGray};
`
const Header = styled.div`
  height: 42px;
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

const VisibilityButton = styled(IconButton)`
  background: ${p => p.theme.color.white};
`
const CloseButton = styled(IconButton)`
  color: white;
`

// TODO delete padding when Monitor-ui component have good padding
const ButtonOnMap = styled(IconButton)`
  height: fit-content;
  padding: 6px;
`

export const MenuWithCloseButton = {
  ButtonOnMap,
  CloseButton,
  Container,
  Header,
  Title,
  VisibilityButton
}
