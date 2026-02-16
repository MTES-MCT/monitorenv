import { Bold } from '@components/style'
import { editMissionInLocalStore } from '@features/Mission/useCases/editMissionInLocalStore'
import { editReportingInLocalStore } from '@features/Reportings/useCases/editReportingInLocalStore'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, Button, Icon, THEME } from '@mtes-mct/monitor-ui'
import { getDateAsLocalizedStringCompact } from '@utils/getDateAsLocalizedString'
import styled from 'styled-components'

import { ReportingContext } from '../../../../../domain/shared_slices/Global'

import type { EventProps } from '@features/Vessel/components/VesselResume/History/YearTimeline'

type ReportingCardProps = {
  reporting: EventProps
}

export function ReportingCard({ reporting }: ReportingCardProps) {
  const dispatch = useAppDispatch()

  const goToMission = (id: number) => {
    dispatch(editMissionInLocalStore(id, 'map'))
  }

  const goToReporting = (id: number) => {
    dispatch(editReportingInLocalStore(id, ReportingContext.MAP))
  }

  return (
    <Card key={reporting.date} $isInfraction={reporting.type === 'REPORTING' && reporting.isInfraction}>
      {reporting.type === 'CONTROL' && <StyledControlIcon color={THEME.color.maximumRed} size={20} />}
      {reporting.type === 'REPORTING' && <StyledReportingIcon color={THEME.color.charcoal} size={20} />}
      <Title>
        <Bold>{reporting.title}</Bold>
        <SubTitle>
          <span>{reporting.source}</span>
          <span>{getDateAsLocalizedStringCompact(reporting.date)}</span>
        </SubTitle>
      </Title>

      {reporting.type === 'CONTROL' && (
        <StyledButton
          accent={Accent.SECONDARY}
          onClick={() => {
            if (reporting.parentId) {
              goToMission(+reporting.parentId)
            }
          }}
        >
          Voir la mission
        </StyledButton>
      )}
      {reporting.type === 'REPORTING' && (
        <StyledButton
          accent={Accent.SECONDARY}
          onClick={() => {
            if (reporting.parentId) {
              goToReporting(+reporting.parentId)
            }
          }}
        >
          Voir le signalement
        </StyledButton>
      )}
    </Card>
  )
}

const Card = styled.li<{ $isInfraction: boolean }>`
  background-color: ${p => (p.$isInfraction ? p.theme.color.maximumRed15 : p.theme.color.gainsboro)};
  display: flex;
  flex-direction: column;
  padding: 16px 44px;
  position: relative;
`

const Title = styled.span`
  display: flex;
  flex-direction: column;
`

const SubTitle = styled.span`
  color: ${p => p.theme.color.slateGray};
  display: flex;
  flex-direction: column;
`

const StyledControlIcon = styled(Icon.ControlUnitFilled)`
  position: absolute;
  top: 16px;
  left: 16px;
`

const StyledReportingIcon = styled(Icon.Report)`
  position: absolute;
  top: 16px;
  left: 16px;
`

const StyledButton = styled(Button)`
  margin: 16px 0 8px;
  width: min-content;
`
