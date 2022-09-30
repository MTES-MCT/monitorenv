import { Radio, RadioGroup } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../constants/constants'

export default {
  title: 'RsuiteMonitor/Selecteurs'
}

function TemplateRadioGrouped({ ...args }) {
  return (
    <>
      <RadioGroup inline {...args} defaultValue="val5">
        <Radio value="val1">Val 1</Radio>
        <Radio disabled value="val2">
          Val 2
        </Radio>
        <Radio value="val3">Val 3</Radio>
        <Radio value="val4">Val 4</Radio>
        <Radio disabled value="val5">
          Val 5
        </Radio>
      </RadioGroup>
      <br />
      <GreyContainer>
        <RadioGroup inline {...args} defaultValue="val3">
          <Radio value="val1">Val 1</Radio>
          <Radio disabled value="val2">
            Val 2
          </Radio>
          <Radio value="val3">Val 3</Radio>
          <Radio value="val4">Val 4</Radio>
          <Radio disabled value="val5">
            Val 5
          </Radio>
        </RadioGroup>
      </GreyContainer>
      <br />
      <RadioGroup inline {...args} appearance="picker" defaultValue="val3">
        <Radio value="val1">Val 1</Radio>
        <Radio disabled value="val2">
          Val 2
        </Radio>
        <Radio value="val3">Val 3</Radio>
        <Radio value="val4">Val 4</Radio>
        <Radio disabled value="val5">
          Val 5
        </Radio>
      </RadioGroup>
      <br />
    </>
  )
}

export const RadioGrouped = TemplateRadioGrouped.bind({})

const GreyContainer = styled.div`
  background: ${COLORS.lightGray};
`
