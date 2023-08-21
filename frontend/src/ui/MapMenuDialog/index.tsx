import { IconButton } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

const Container = styled.div`
  width: 320px;
  max-height: 520px;
  margin-right: 6px;
  background-color: ${p => p.theme.color.white};
  box-shadow: 0px 3px 6px ${p => p.theme.color.slateGray};
  position: relative;
`

const Header = styled.div`
  height: 40px;
  background-color: ${p => p.theme.color.charcoal};
  display: flex;
  justify-content: space-between;
  padding-right: 4px;
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
  background-color: ${p => p.theme.color.gainsboro};
`

const CloseButton = styled(IconButton)`
  color: white;
`

const Footer = styled.div`
  background: ${p => p.theme.color.white};
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  position: absolute;
  bottom: 0;
  width: 100%;
  z-index: 10;
`

export const MapMenuDialog = {
  Body,
  CloseButton,
  Container,
  Footer,
  Header,
  Title,
  VisibilityButton
}
