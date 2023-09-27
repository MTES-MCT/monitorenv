import { THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

const reqSvgs = require.context('../icons', true, /\.svg$/)

export default {
  title: 'Monitor/Icons'
}

function Template({ background, color }) {
  return (
    <Gallery>
      {reqSvgs.keys().map(path => (
        <ImageWrapper key={path}>
          <Img $background={background} color={color} src={reqSvgs(path)} />
          {path}
        </ImageWrapper>
      ))}
    </Gallery>
  )
}

export const NoBackground = Template.bind({})
export const WithBackground = Template.bind({})
WithBackground.args = {
  background: THEME.color.charcoal,
  color: THEME.color.white
}

const Img = styled.img`
  background: ${p => p.$background || p.theme.color.white};
  color: ${p => p.color || p.theme.color.charcoal};
  width: 50px;
  margin: 3px;
`
const ImageWrapper = styled.div``

const Gallery = styled.div`
  height: 100%;
  overflow: auto;
`
