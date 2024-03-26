import { Icon, THEME } from '@mtes-mct/monitor-ui'

import { Accented, SummaryContent, Title } from '../style'

export function LandControlCard({ action }) {
  return (
    <>
      <Icon.Anchor color={THEME.color.charcoal} size={20} />
      <SummaryContent>
        <Title>Contrôle à la débarque</Title>
        <br />
        <Accented>{action.vesselName ?? 'Navire inconnu'}</Accented>
      </SummaryContent>
    </>
  )
}
