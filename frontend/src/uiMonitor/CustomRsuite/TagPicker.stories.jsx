import { useState } from 'react'
import { TagPicker } from 'rsuite'

const data = ['Eugenia', 'Bryan', 'Linda', 'Nancy', 'Lloyd', 'Alice', 'Julia', 'Albert'].map(item => ({
  label: item,
  value: item
}))

const styles = { display: 'block', marginBottom: 10, width: 300 }

export default {
  title: 'RsuiteMonitor/Selecteurs'
}

function TagPickerTemplate({ appearance }) {
  const [value, setValue] = useState()

  return (
    <>
      Large
      <TagPicker
        appearance={appearance}
        data={data}
        onChange={setValue}
        placeholder="Large"
        size="lg"
        style={styles}
        value={value}
      />
      Medium
      <TagPicker
        appearance={appearance}
        data={data}
        onChange={setValue}
        placeholder="Medium"
        size="md"
        style={styles}
        value={value}
      />
      Default
      <TagPicker
        appearance={appearance}
        data={data}
        onChange={setValue}
        placeholder="Default"
        style={styles}
        value={value}
      />
      Small
      <TagPicker
        appearance={appearance}
        data={data}
        onChange={setValue}
        placeholder="Small"
        size="sm"
        style={styles}
        value={value}
      />
      XSmall
      <TagPicker
        appearance={appearance}
        data={data}
        onChange={setValue}
        placeholder="XSmall"
        size="xs"
        style={styles}
        value={value}
      />
    </>
  )
}

export const TagPickerSizes = TagPickerTemplate.bind({})
TagPickerSizes.args = {
  appearance: 'default'
}
TagPickerSizes.argTypes = {
  appearance: {
    control: 'select',
    options: ['default', 'ghost', 'primary']
  }
}
