import styled from 'styled-components'

import { COLORS } from '../../constants/constants'

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
  background: COLORS.charcoal,
  color: 'white'
}

const Img = styled.img`
  background: ${({ $background }) => $background || COLORS.white};
  color: ${({ color }) => color || COLORS.charcoal};
  width: 50px;
  margin: 3px;
`
const ImageWrapper = styled.div``

const Gallery = styled.div`
  height: 100%;
  overflow: auto;
`
