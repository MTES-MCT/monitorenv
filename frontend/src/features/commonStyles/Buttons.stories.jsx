import React from 'react';

import { PrimaryButton, SecondaryButton, BackofficeSecondaryButton } from './Buttons.style';

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

const TemplateSecondaryBackoffice = ({label, ...args}) => <BackofficeSecondaryButton {...args}>{label}</BackofficeSecondaryButton>;

export const BackofficeSecondary = TemplateSecondaryBackoffice.bind({});
BackofficeSecondary.args = {
  label: 'Enregistrer',
};