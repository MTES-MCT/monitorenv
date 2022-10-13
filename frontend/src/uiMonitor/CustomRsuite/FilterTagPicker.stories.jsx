import { useState } from 'react'

import { FilterTagPicker } from './FilterTagPicker'

const data = ['Eugenia', 'Bryan', 'Linda', 'Nancy', 'Lloyd', 'Alice', 'Julia', 'Albert'].map(item => ({
  label: item,
  value: item
}))

const styles = { display: 'block', marginBottom: 10, width: 300 }

export default {
  title: 'RsuiteMonitor/Selecteurs'
}

function FilterTagPickerTemplate({ placeholder }) {
  const [value, setValue] = useState()

  return (
    <>
      <FilterTagPicker data={data} onChange={setValue} placeholder={placeholder} value={value} />
      <hr />
      <FilterTagPicker data={data} onChange={setValue} placeholder={placeholder} style={styles} value={value} />
      <hr />
    </>
  )
}

export const FilterTagPickerStyles = FilterTagPickerTemplate.bind({})
FilterTagPickerStyles.args = {
  placeholder: 'Libellé'
}
FilterTagPickerStyles.argTypes = {}
