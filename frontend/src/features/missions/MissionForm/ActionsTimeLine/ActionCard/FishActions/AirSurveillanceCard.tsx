import { Icon, THEME } from '@mtes-mct/monitor-ui'

import { Accented, SummaryContent, Title } from '../style'

export function AirSurveillanceCard({ action }) {
  return (
    <>
      <Icon.Observation color={THEME.color.charcoal} size={20} />
      <SummaryContent>
        <Title>Surveillance aérienne</Title>
        <br />
        <Accented>
          {action.numberOfVesselsFlownOver ? `${action.numberOfVesselsFlownOver} pistes survolées` : undefined}
        </Accented>
      </SummaryContent>
    </>
  )
}
