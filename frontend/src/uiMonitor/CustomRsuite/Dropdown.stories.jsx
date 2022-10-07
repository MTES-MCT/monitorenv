import { Dropdown } from 'rsuite'
import styled from 'styled-components'

import { ReactComponent as ControlSVG } from '../icons/Control.svg'
import { ReactComponent as NoteSVG } from '../icons/note_libre.svg'
import { ReactComponent as SurveillanceSVG } from '../icons/Observation.svg'
import { ReactComponent as PlusSVG } from '../icons/Plus.svg'

export default {
  title: 'RsuiteMonitor/Dropdown'
}

function TemplateDropdown({ label = 'Ajouter', ...args }) {
  const handleClick = e => {
    console.log(e)
  }

  return (
    <>
      <Dropdown appearance="primary" icon={<PlusSVG className="rs-icon" />} noCaret title={label}>
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
      <hr />
      <Dropdown appearance="primary" icon={<PlusSVG className="rs-icon" />} noCaret size="sm" title={label}>
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
      <hr />
      <Dropdown appearance="primary" icon={<PlusSVG className="rs-icon" />} noCaret size="md" title="Ajouter">
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
    </>
  )
}

export const DropdownWithIcons = TemplateDropdown.bind({})

const ControlSVGIcon = styled(ControlSVG)``

const SurveillanceSVGIcon = styled(SurveillanceSVG)``
const NoteSVGIcon = styled(NoteSVG)``
