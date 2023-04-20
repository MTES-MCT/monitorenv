import { ButtonToolbar, Button, IconButton } from 'rsuite'

import { ReactComponent as CalendarSVG } from '../icons/Calendar.svg'
import { ReactComponent as EditIconSVG } from '../icons/Edit.svg'

export default {
  title: 'MonitorEnv/Buttons'
}

function TemplateButtons({ label, ...args }) {
  return (
    <>
      <ButtonToolbar>
        <Button appearance="default" {...args}>
          Default
        </Button>
        <Button appearance="primary" {...args}>
          Primary
        </Button>
        <Button appearance="link" {...args}>
          Link
        </Button>
        <Button appearance="subtle" {...args}>
          Subtle
        </Button>
        <Button appearance="ghost" {...args}>
          Ghost
        </Button>
      </ButtonToolbar>
      <br />
      <ButtonToolbar>
        <Button appearance="default" {...args}>
          {label}
        </Button>
        <Button appearance="primary" {...args}>
          {label}
        </Button>
        <Button appearance="link" {...args}>
          {label}
        </Button>
        <Button appearance="subtle" {...args}>
          {label}
        </Button>
        <Button appearance="ghost" {...args}>
          {label}
        </Button>
      </ButtonToolbar>
      <br />
      <ButtonToolbar>
        <IconButton appearance="default" {...args} icon={<EditIconSVG className="rs-icon" />}>
          Default
        </IconButton>
        <IconButton appearance="primary" {...args} icon={<EditIconSVG className="rs-icon" />}>
          Primary
        </IconButton>
        <IconButton appearance="link" {...args} icon={<EditIconSVG className="rs-icon" />}>
          Link
        </IconButton>
        <IconButton appearance="subtle" {...args} icon={<EditIconSVG className="rs-icon" />}>
          Subtle
        </IconButton>
        <IconButton appearance="ghost" {...args} icon={<EditIconSVG className="rs-icon" />}>
          Ghost
        </IconButton>
      </ButtonToolbar>
      <br />
      <ButtonToolbar>
        <IconButton appearance="default" {...args} icon={<EditIconSVG className="rs-icon" />}>
          {label}
        </IconButton>
        <IconButton appearance="primary" {...args} icon={<EditIconSVG className="rs-icon" />}>
          {label}
        </IconButton>
        <IconButton appearance="link" {...args} icon={<EditIconSVG className="rs-icon" />}>
          {label}
        </IconButton>
        <IconButton appearance="subtle" {...args} icon={<EditIconSVG className="rs-icon" />}>
          {label}
        </IconButton>
        <IconButton appearance="ghost" {...args} icon={<EditIconSVG className="rs-icon" />}>
          {label}
        </IconButton>
      </ButtonToolbar>
      <br />
      <ButtonToolbar>
        <IconButton appearance="default" {...args} icon={<CalendarSVG className="rs-icon" />}>
          Default
        </IconButton>
        <IconButton appearance="primary" {...args} icon={<CalendarSVG className="rs-icon" />}>
          Primary
        </IconButton>
        <IconButton appearance="link" {...args} icon={<CalendarSVG className="rs-icon" />}>
          Link
        </IconButton>
        <IconButton appearance="subtle" {...args} icon={<CalendarSVG className="rs-icon" />}>
          Subtle
        </IconButton>
        <IconButton appearance="ghost" {...args} icon={<CalendarSVG className="rs-icon" />}>
          Ghost
        </IconButton>
      </ButtonToolbar>
      <br />
      <ButtonToolbar>
        <IconButton appearance="default" {...args} icon={<CalendarSVG className="rs-icon" />}>
          {label}
        </IconButton>
        <IconButton appearance="primary" {...args} icon={<CalendarSVG className="rs-icon" />}>
          {label}
        </IconButton>
        <IconButton appearance="link" {...args} icon={<CalendarSVG className="rs-icon" />}>
          {label}
        </IconButton>
        <IconButton appearance="subtle" {...args} icon={<CalendarSVG className="rs-icon" />}>
          {label}
        </IconButton>
        <IconButton appearance="ghost" {...args} icon={<CalendarSVG className="rs-icon" />}>
          {label}
        </IconButton>
      </ButtonToolbar>
    </>
  )
}

export const ButtonsStyles = TemplateButtons.bind({})
ButtonsStyles.argTypes = {
  size: {
    control: 'select',
    options: ['md', 'sm', undefined]
  }
}
ButtonsStyles.args = {
  label: 'Enregistrer',
  size: 'md'
}

function TemplateIconButtons({ label, ...args }) {
  return (
    <>
      <h3>Primary</h3>
      <p>(rsuite: appearance=&quot;primary&quot;)</p>
      <ButtonToolbar>
        <IconButton appearance="primary" size="lg" {...args} icon={<CalendarSVG className="rs-icon" />} />
        <IconButton appearance="primary" {...args} icon={<CalendarSVG className="rs-icon" />} />
        <IconButton appearance="primary" size="md" {...args} icon={<CalendarSVG className="rs-icon" />} />
      </ButtonToolbar>
      <br />
      <h3>Secondary</h3>
      <p>(rsuite: appearance=&quot;ghost&quot;)</p>
      <ButtonToolbar>
        <IconButton appearance="ghost" size="lg" {...args} icon={<CalendarSVG className="rs-icon" />} />
        <IconButton appearance="ghost" {...args} icon={<CalendarSVG className="rs-icon" />} />
        <IconButton appearance="ghost" size="md" {...args} icon={<CalendarSVG className="rs-icon" />} />
      </ButtonToolbar>
      <br />
      <h3>Tertiary</h3>
      <p>(rsuite: appearance=&quot;subtle&quot;)</p>
      <ButtonToolbar>
        <IconButton appearance="subtle" size="lg" {...args} icon={<CalendarSVG className="rs-icon" />} />
        <IconButton appearance="subtle" {...args} icon={<CalendarSVG className="rs-icon" />} />
        <IconButton appearance="subtle" size="md" {...args} icon={<CalendarSVG className="rs-icon" />} />
        <IconButton appearance="subtle" size="sm" {...args} icon={<CalendarSVG className="rs-icon" />} />
      </ButtonToolbar>
      <br />
      <br />
    </>
  )
}
export const IconButtons = TemplateIconButtons.bind({})

function TemplateSpecialStates({ label, ...args }) {
  return (
    <>
      <ButtonToolbar>
        <IconButton active appearance="primary" {...args} icon={<CalendarSVG className="rs-icon" />} />
        <IconButton active appearance="ghost" {...args} icon={<CalendarSVG className="rs-icon" />} />
        <IconButton active appearance="subtle" {...args} icon={<CalendarSVG className="rs-icon" />} />
        <IconButton active appearance="primary" {...args} icon={<CalendarSVG className="rs-icon" />}>
          {label}
        </IconButton>
        <Button active appearance="primary" {...args}>
          Primary Active
        </Button>
        <Button active appearance="ghost" {...args}>
          Ghost Active
        </Button>
        <Button active appearance="default" {...args}>
          Default(tertiary) Active
        </Button>
        <Button active appearance="link" {...args}>
          Link Active
        </Button>
      </ButtonToolbar>
      <br />
      <ButtonToolbar>
        <IconButton appearance="primary" disabled {...args} icon={<CalendarSVG className="rs-icon" />} />
        <IconButton appearance="ghost" disabled {...args} icon={<CalendarSVG className="rs-icon" />} />
        <IconButton appearance="subtle" disabled {...args} icon={<CalendarSVG className="rs-icon" />} />
        <IconButton appearance="primary" disabled {...args} icon={<CalendarSVG className="rs-icon" />}>
          {label}
        </IconButton>
        <Button appearance="primary" disabled {...args}>
          Primary Disabled
        </Button>
        <Button appearance="ghost" disabled {...args}>
          Ghost Disabled
        </Button>
        <Button appearance="default" disabled {...args}>
          Default(tertiary) Disabled
        </Button>
        <Button appearance="link" disabled {...args}>
          Link Disabled
        </Button>
      </ButtonToolbar>
    </>
  )
}

export const SpecialButtonStates = TemplateSpecialStates.bind({})
SpecialButtonStates.args = {
  label: 'Special states'
}
