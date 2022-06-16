import React from 'react';

import { PrimaryButton, SecondaryButton, EditButton } from './Buttons.style';

export default {
  title: 'MonitorEnv/Buttons',
  component: PrimaryButton,
};

const TemplatePrimary = ({label, ...args}) => <PrimaryButton {...args}>{label}</PrimaryButton>;

export const Primary = TemplatePrimary.bind({});
Primary.args = {
  label: 'Enregistrer',
};


const TemplateSecondary = ({label, ...args}) => <SecondaryButton {...args}>{label}</SecondaryButton>;

export const Secondary = TemplateSecondary.bind({});
Secondary.args = {
  label: 'Enregistrer',
};

const TemplateEditButton = ({label, ...args}) => <EditButton {...args}>{label}</EditButton>;

export const Edit = TemplateEditButton.bind({});
EditButton.args = {
  label: 'Enregistrer',
};

