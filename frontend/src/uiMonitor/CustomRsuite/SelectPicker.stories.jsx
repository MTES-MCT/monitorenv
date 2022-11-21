import { useState } from 'react'

import { SelectPickerWhite } from './SelectPicker'

export default {
  title: 'RsuiteMonitor/Selecteurs'
}

const dataReduced = ['Eugenia', 'Bryan', 'Linda', 'Nancy', 'Lloyd', 'Alice', 'Julia', 'Albert'].map(item => ({
  label: item,
  value: item
}))
const dataExtended = [
  'Eugenia',
  'Bryan',
  'Linda',
  'Nancy',
  'Lloyd',
  'Alice',
  'Julia',
  'Albert',
  'Francis',
  'Jenna',
  'Dunkan',
  'Jordan',
  'Emma',
  'Anna',
  'Sophia',
  'Robert',
  'Kevin',
  'Jonathan',
  'Hubert',
  'Kalil',
  'David',
  'Dan',
  'Douglas'
].map(item => ({
  label: item,
  value: item
}))

function SelectPickerWithRefTemplate({ data }) {
  const [val, setVal] = useState(data[1].value)
  const handleChange = v => {
    setVal(v)
    console.log(v)
  }

  return (
    <SelectPickerWhite
      data={data}
      labelKey="label"
      onChange={handleChange}
      searchable
      size="sm"
      value={val}
      valueKey="value"
    />
  )
}

export const SelectPickerWithRef = SelectPickerWithRefTemplate.bind({})
SelectPickerWithRef.args = {
  data: dataReduced
}
export const SelectPickerWithRefMoreChoices = SelectPickerWithRefTemplate.bind({})
SelectPickerWithRefMoreChoices.args = {
  data: dataExtended
}
