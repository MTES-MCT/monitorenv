import { TagPicker as TagPickerComponent } from 'rsuite'

const data = ['Eugenia', 'Bryan', 'Linda', 'Nancy', 'Lloyd', 'Alice', 'Julia', 'Albert'].map(item => ({
  label: item,
  value: item
}))

const styles = { display: 'block', marginBottom: 10, width: 300 }

export default {
  title: 'RsuiteMonitor/Selecteurs'
}

function TagPickerTemplate() {
  return (
    <>
      Large
      <TagPickerComponent data={data} placeholder="Large" size="lg" style={styles} />
      Medium
      <TagPickerComponent data={data} placeholder="Medium" size="md" style={styles} />
      Small
      <TagPickerComponent data={data} placeholder="Small" size="sm" style={styles} />
      XSmall
      <TagPickerComponent data={data} placeholder="XSmall" size="xs" style={styles} />
    </>
  )
}

export const TagPicker = TagPickerTemplate.bind({})
