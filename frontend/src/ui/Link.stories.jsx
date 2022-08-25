import React from 'react'
import { Link as ALink } from './Link';

export default {
  title: 'MonitorEnv/Link',
  component: ALink,
};

const Template = ({name, ...args}) => {
  return (
    <>
      <ALink  {...args} >{name}</ALink>
      <br/>
      <ALink  {...args} tagUrl>{name}</ALink>
    </>
  )
}

export const Link = Template.bind({})
Link.args = {
  name: "Décret n° 2012-507 du 18 avril 2012 créant le Parc national des Calanques"
}