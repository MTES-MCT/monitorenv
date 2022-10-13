import styled from 'styled-components'

import { COLORS } from '../constants/constants'

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`
const ColorSample = styled.div`
  width: 120px;
  height: 120px;
  margin: 5px;
  display: inline-block;
  background-color: ${props => props.color};
  border: 1px solid black;
`

export default {
  component: ColorSample,
  title: 'Monitor/Colors'
}

function Template() {
  return (
    <Wrapper>
      {Object.entries(COLORS).map(([key, value]) => (
        <ColorSample key={key} color={value}>
          {key}-{value}
        </ColorSample>
      ))}
    </Wrapper>
  )
}

export const Primary = Template.bind({})
