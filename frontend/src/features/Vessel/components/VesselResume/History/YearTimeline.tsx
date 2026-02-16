import { Bold } from '@components/style'
import { ReportingCard } from '@features/Vessel/components/VesselResume/History/ReportingCard'
import { customDayjs, Icon, pluralize, THEME } from '@mtes-mct/monitor-ui'
import { useState } from 'react'
import styled from 'styled-components'

type YearTimelineProps = {
  envActions: EventProps[]
  suspicionOfInfractions: EventProps[]
  totalInfractions: number
  totalPV: number
  year: number
}

export type EventProps = {
  date?: string
  isInfraction: boolean
  parentId?: string | number
  source?: string
  title?: string
  type: 'REPORTING' | 'CONTROL'
}

export function YearTimeline({
  envActions,
  suspicionOfInfractions,
  totalInfractions,
  totalPV,
  year
}: YearTimelineProps) {
  const [isSummaryOpen, setSummaryOpen] = useState(false)

  const history = envActions
    .concat(suspicionOfInfractions)
    .sort((a, b) => customDayjs(b.date).diff(customDayjs(a.date)))

  const getTitle = (quantity: number, suffix: 'signalement' | 'contrôle') =>
    quantity > 0 ? (
      <Bold>
        {quantity} {pluralize(suffix, quantity)}
      </Bold>
    ) : (
      <>aucun {suffix}</>
    )

  return (
    <YearListItem>
      <Details
        onToggle={event => {
          if (event.target) {
            const elt = event.target as HTMLDetailsElement
            setSummaryOpen(elt.open)
          }
        }}
        open={isSummaryOpen}
      >
        <Summary>
          <span>
            <Year>{year}</Year>{' '}
            {suspicionOfInfractions.length === 0 && envActions.length === 0 ? (
              'Aucun contrôle ou signalement'
            ) : (
              <>
                {getTitle(suspicionOfInfractions.length, 'signalement')}
                {', '} {getTitle(envActions.length, 'contrôle')}{' '}
                <Bold>
                  {totalInfractions !== 0 && `, ${totalInfractions} ${pluralize('infraction', totalInfractions)}`}
                </Bold>
                {totalPV !== 0 && `, ${totalPV} PV`}
              </>
            )}
          </span>
          {(suspicionOfInfractions.length !== 0 || envActions.length !== 0) && (
            <Chevron $isOpen={isSummaryOpen} color={THEME.color.slateGray} size={16} />
          )}
        </Summary>
        {history.length > 0 && (
          <CardWrapper>
            {history.map(event => (
              <ReportingCard key={`${event.title} ${event.parentId}`} reporting={event} />
            ))}
          </CardWrapper>
        )}
      </Details>
    </YearListItem>
  )
}

const YearListItem = styled.li`
  display: flex;
  border-bottom: 1px solid ${p => p.theme.color.lightGray};
`

const Year = styled.span`
  color: ${p => p.theme.color.slateGray};
  font-weight: 500;
  margin-right: 16px;
`

const Details = styled.details`
  cursor: pointer;
  flex: 1;
`

const Summary = styled.summary`
  display: flex;
  justify-content: space-between;
  padding: 10px 16px;
`

const Chevron = styled(Icon.Chevron)<{ $isOpen: boolean }>`
  ${p => p.$isOpen && `transform: rotate(-180deg);`}
  transition: all 0.2s;
`

const CardWrapper = styled.ol`
  border-top: 1px solid ${p => p.theme.color.lightGray};
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 16px;
`
