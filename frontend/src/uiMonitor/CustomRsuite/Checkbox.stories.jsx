import { useState } from 'react'
import { Checkbox, CheckboxGroup } from 'rsuite'
import styled from 'styled-components'

export default {
  title: 'RsuiteMonitor/Selecteurs'
}

const options = ['A', 'B', 'C', 'D', 'E']

function TemplateCheckboxGrouped() {
  const [checkboxState, setCheckboxState] = useState({
    checkAll: false,
    indeterminate: true,
    value: ['A', 'C', 'E']
  })
  const handleCheckAll = (value, checked) => {
    const nextValue = checked ? options : []
    console.log(value, nextValue, 'handleCheckAll')
    setCheckboxState({
      checkAll: checked,
      indeterminate: false,
      value: nextValue
    })
  }
  const handleChange = value => {
    console.log(value, 'handleChange')
    setCheckboxState({
      checkAll: value.length === options.length,
      indeterminate: value.length > 0 && value.length < options.length,
      value
    })
  }

  return (
    <>
      <div>
        <Checkbox
          checked={checkboxState.checkAll}
          indeterminate={checkboxState.indeterminate}
          onChange={handleCheckAll}
        >
          Check all
        </Checkbox>
        <hr />
        <CheckboxGroup inline name="checkboxList" onChange={handleChange} value={checkboxState.value}>
          <Checkbox value="A">Item A</Checkbox>
          <Checkbox value="B">Item B</Checkbox>
          <Checkbox value="C">Item C</Checkbox>
          <Checkbox disabled value="D">
            Item D - disabled
          </Checkbox>
          <Checkbox disabled value="E">
            Item E - disabled
          </Checkbox>
        </CheckboxGroup>
      </div>
      <GreyContainer>
        <Checkbox
          checked={checkboxState.checkAll}
          indeterminate={checkboxState.indeterminate}
          onChange={handleCheckAll}
        >
          Check all
        </Checkbox>
        <hr />
        <CheckboxGroup inline name="checkboxList" onChange={handleChange} value={checkboxState.value}>
          <Checkbox value="A">Item A</Checkbox>
          <Checkbox value="B">Item B</Checkbox>
          <Checkbox value="C">Item C</Checkbox>
          <Checkbox disabled value="D">
            Item D - disabled
          </Checkbox>
          <Checkbox disabled value="E">
            Item E - disabled
          </Checkbox>
        </CheckboxGroup>
      </GreyContainer>
    </>
  )
}

export const CheckboxGrouped = TemplateCheckboxGrouped.bind({})

const GreyContainer = styled.div`
  background: ${p => p.theme.color.lightGray};
`
