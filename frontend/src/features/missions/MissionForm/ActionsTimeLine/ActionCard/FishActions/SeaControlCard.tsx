import { Icon, THEME } from '@mtes-mct/monitor-ui'

import { Accented, SummaryContent, Title } from '../style'

export function SeaControlCard({ action }) {
  return (
    <>
      <Icon.FleetSegment color={THEME.color.charcoal} size={20} />
      <SummaryContent>
        <Title>Contrôle en mer</Title>
        <br />
        <Accented>{action.vesselName ?? 'Navire inconnu'}</Accented>
      </SummaryContent>{' '}
    </>
  )
}
