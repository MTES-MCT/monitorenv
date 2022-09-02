import React from 'react';
import { Tag, TagGroup } from 'rsuite';


export default {
  title: 'RsuiteMonitor/Tags'
};

const TemplateTagGroup = ({text}) => (
  <>
    <TagGroup>
      <Tag >Default</Tag>
      <Tag size="lg">Large</Tag>
      <Tag size="md">Medium</Tag>
      <Tag size="sm">Small</Tag>
    </TagGroup>
    <hr/>
    <TagGroup>
      <Tag size="lg">{text}</Tag>
      <Tag size="md">{text}</Tag>
      <Tag size="sm">{text}</Tag>
    </TagGroup>
  </>
);

export const Tags = TemplateTagGroup.bind({})
Tags.args = {
  text: '0 INF SANS PV'
}