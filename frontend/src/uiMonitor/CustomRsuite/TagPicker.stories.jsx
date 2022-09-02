import React from 'react'
import { TagPicker as TagPickerComponent } from 'rsuite';

const data = ['Eugenia', 'Bryan', 'Linda', 'Nancy', 'Lloyd', 'Alice', 'Julia', 'Albert'].map(
  item => ({ label: item, value: item })
);

const styles = { width: 300, display: 'block', marginBottom: 10 };

export default {
  title: 'RsuiteMonitor/Selecteurs'
};

const TagPickerTemplate = () => (
  <>
    Large 
    <TagPickerComponent size="lg" placeholder="Large" data={data} style={styles} />
    Medium
    <TagPickerComponent size="md" placeholder="Medium" data={data} style={styles} />
    Small
    <TagPickerComponent size="sm" placeholder="Small" data={data} style={styles} />
    XSmall
    <TagPickerComponent size="xs" placeholder="XSmall" data={data} style={styles} />
  </>
);


export const TagPicker = TagPickerTemplate.bind({})