import { getVesselName } from '@features/Mission/utils'
import { Icon, THEME } from '@mtes-mct/monitor-ui'

import { Accented, SummaryContent, Title } from '../style'

export function LandControlCard({ action }) {
  const vesselName = getVesselName(action.vesselName)

  return (
    <>
      <Icon.Anchor color={THEME.color.charcoal} size={20} />
      <SummaryContent>
        <Title>Contrôle à la débarque</Title>
        <br />
        <Accented>{vesselName}</Accented>
      </SummaryContent>
    </>
  )
}
