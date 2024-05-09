import { getVesselName } from '@features/Mission/utils'
import { Icon, THEME } from '@mtes-mct/monitor-ui'

import { Accented, SummaryContent, Title } from '../style'

export function AirControlCard({ action }) {
  const vesselName = getVesselName(action.vesselName)

  return (
    <>
      <Icon.Plane color={THEME.color.charcoal} size={20} />
      <SummaryContent>
        <Title>Contrôle aérien</Title>
        <br />
        <Accented>{vesselName}</Accented>
      </SummaryContent>
    </>
  )
}
