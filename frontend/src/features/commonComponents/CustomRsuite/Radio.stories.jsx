import React from 'react';

import { Radio, RadioGroup } from './Radio';

export default {
  title: 'MonitorEnv/Radio'
};

const TemplateRadioGrouped = ({...args}) => {
  return (<RadioGroup 
    inline 
    appearance="picker"
    {...args}
    defaultValue="val3"
  >
    <Radio value={"val1"}>Val 1</Radio>
    <Radio value={"val2"} disabled>Val 2</Radio>
    <Radio value={"val3"}>Val 3</Radio>
    <Radio value={"val4"}>Val 4</Radio>
  </RadioGroup>)
}

export const RadioGrouped = TemplateRadioGrouped.bind({})