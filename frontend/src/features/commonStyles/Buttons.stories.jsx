import React from 'react';

import { PrimaryButton, SecondaryButton, EditButton } from './Buttons.style';

export default {
  title: 'MonitorEnv/Buttons'
};

const TemplatePrimary = ({label, ...args}) => <PrimaryButton {...args}>{label}</PrimaryButton>;

export const Primary = TemplatePrimary.bind({});
Primary.args = {
  label: 'Enregistrer',
};

export const PrimaryWidthPx = TemplatePrimary.bind({})
PrimaryWidthPx.args = {
  label: 'Enregistrer et quitter',
  width: '500px'
}
export const PrimaryWidthPct = TemplatePrimary.bind({})
PrimaryWidthPct.args = {
  label: 'Enregistrer tout sans quitter',
  width: '50%'
}

const TemplateSecondary = ({label, ...args}) => <SecondaryButton {...args}>{label}</SecondaryButton>;

export const Secondary = TemplateSecondary.bind({});
Secondary.args = {
  label: 'Enregistrer',
};

const TemplateEditButton = ({label, ...args}) => <EditButton {...args}>{label}</EditButton>;

export const Edit = TemplateEditButton.bind({});
EditButton.args = {
  label: 'Editer',
};

