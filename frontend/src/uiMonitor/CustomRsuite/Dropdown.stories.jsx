import { Dropdown } from 'rsuite'
import styled from 'styled-components'

import { ReactComponent as ControlSVG } from '../icons/controles.svg'
import { ReactComponent as NoteSVG } from '../icons/note_libre.svg'
import { ReactComponent as PlusSVG } from '../icons/plus.svg'
import { ReactComponent as SurveillanceSVG } from '../icons/surveillance_18px.svg'

export default {
  title: 'RsuiteMonitor/Dropdown'
}

function CustDropDown({ handleClick, size = 'sm' }) {
  return (
    <Dropdown appearance="primary" icon={<PlusSVG />} noCaret size={size} title="Ajouter">
      <Dropdown.Item icon={<ControlSVGIcon />} onClick={handleClick}>
        Ajouter des contrôles
      </Dropdown.Item>
      <Dropdown.Item icon={<SurveillanceSVGIcon />} onClick={handleClick}>
        Ajouter une surveillance
      </Dropdown.Item>
      <Dropdown.Item icon={<NoteSVGIcon />} onClick={handleClick}>
        Ajouter une note libre
      </Dropdown.Item>
    </Dropdown>
  )
}
function TemplateDropdown() {
  const handleClick = e => {
    console.log(e)
  }

  return (
    <>
      <CustDropDown handleClick={handleClick} />
      <hr />
      <CustDropDown handleClick={handleClick} size="md" />
    </>
  )
}

export const DropdownWithIcons = TemplateDropdown.bind({})

const ControlSVGIcon = styled(ControlSVG)`
  width: 18px;
  padding: 2px;
  margin-right: 10px;
`

const SurveillanceSVGIcon = styled(SurveillanceSVG)`
  margin-right: 10px;
`
const NoteSVGIcon = styled(NoteSVG)`
  margin-right: 10px;
`
