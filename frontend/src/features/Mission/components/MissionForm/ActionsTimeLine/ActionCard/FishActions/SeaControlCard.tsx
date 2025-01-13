import { getVesselName } from '@features/Mission/utils'
import { Icon, THEME } from '@mtes-mct/monitor-ui'

import { Accented, SummaryContent, Title } from '../style'

export function SeaControlCard({ action }) {
  const vesselName = getVesselName(action.vesselName)

  return (
    <>
      <Icon.FleetSegment color={THEME.color.charcoal} size={20} />
      <SummaryContent>
        <Title>Contrôle en mer</Title>
        <br />
        <Accented>{vesselName}</Accented>
      </SummaryContent>{' '}
    </>
  )
}
