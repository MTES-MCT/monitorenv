import { useState } from 'react'
import styled from 'styled-components'

export function MapAttributionsBox({ position = 'left' }: { position?: 'right' | 'left' }) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <Wrapper $position={position} className="ol-unselectable ol-control">
      <List className={isVisible ? '' : 'collapsed'}>
        <ListItem>
          <Link data-bcup-haslogintext="no" href="https://www.openstreetmap.org/copyright" target="_blank">
            © OpenStreetMap contributors
          </Link>
        </ListItem>
      </List>
      <Button data-bcup-haslogintext="no" onClick={() => setIsVisible(!isVisible)} title="Attributions" type="button">
        <ButtonText>©</ButtonText>
      </Button>
    </Wrapper>
  )
}

const Wrapper = styled.div<{ $position: 'right' | 'left' }>`
  bottom: 8px;
  ${p => (p.$position === 'left' ? 'left: 0.5em;' : 'right: 0.5em;')}
  max-width: calc(100% - 1.3em);
  background: none;
`

const Button = styled.button`
  float: left;
  width: 25px !important;
  height: 25px !important;

  &:hover {
    background: none;
  }
`

const ButtonText = styled.span`
  font-size: 16px;
`

const List = styled.ul`
  font-size: 0.9em;
  background-color: ${p => p.theme.color.gainsboro};
  height: 1.5em;
  border: none;
  border-radius: 0;
  margin: 2px;
  padding: 4px 5px 0px 5px;
`

const ListItem = styled.li`
  font-size: 13px;
  list-style-type: none;
  margin: 0;
`

const Link = styled.a`
  color: ${p => p.theme.color.slateGray};
`
