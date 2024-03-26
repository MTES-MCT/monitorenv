import { Icon, THEME } from '@mtes-mct/monitor-ui'

import { Accented, SummaryContent, Title } from '../style'

export function AirControlCard({ action }) {
  return (
    <>
      <Icon.Plane color={THEME.color.charcoal} size={20} />
      <SummaryContent>
        <Title>Contrôle aérien</Title>
        <br />
        <Accented>{action.vesselName ?? 'Navire inconnu'}</Accented>
      </SummaryContent>
    </>
  )
}
