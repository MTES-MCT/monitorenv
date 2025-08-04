import { Bold, Italic } from '@components/style'
import { Tooltip } from '@components/Tooltip'
import { useAppSelector } from '@hooks/useAppSelector'
import { Icon, pluralize, THEME } from '@mtes-mct/monitor-ui'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useDebounce } from 'use-debounce'

import { ReportingContext } from '../../../../../../domain/shared_slices/Global'
import {
  initialHistory,
  useGetHistoryOfInfractions,
  type HistoryOfInfractionsProps
} from '../../hooks/useGetHistoryOfInfractions'

const NB_CHAR_MMSI = 9

export function HistoryOfInfractions({
  isReadOnly = false,
  mmsi,
  reportingId
}: {
  isReadOnly?: boolean
  mmsi: string | undefined
  reportingId: string | number
}) {
  const reportingContext =
    useAppSelector(state => (reportingId ? state.reporting.reportings[reportingId]?.context : undefined)) ??
    ReportingContext.MAP

  const [debouncedMmsi] = useDebounce(mmsi, 300)

  const canSearch = !!(reportingId && debouncedMmsi && debouncedMmsi.length === NB_CHAR_MMSI)

  const getHistoryByMmsi = useGetHistoryOfInfractions()

  const [history, setHistory] = useState<HistoryOfInfractionsProps>(initialHistory)

  useEffect(() => {
    const fetchHistory = async () => {
      if (!canSearch || !debouncedMmsi) {
        setHistory(initialHistory)

        return
      }
      const result = await getHistoryByMmsi({
        canSearch,
        debouncedMmsi,
        reportingId
      })
      setHistory(result ?? initialHistory)
    }

    fetchHistory()

    // no need to listen getHistoryByMmsi
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canSearch, debouncedMmsi, reportingId])

  const informationsMessage = isReadOnly
    ? 'ne peuvent être affichés que si un MMSI est rentré'
    : 'entrez un MMSI pour lancer la recherche'

  const totalSuspicionOfInfractions = history.suspicionOfInfractions.length ?? 0
  const dotColor = () => {
    if (history.totalInfraction === 0) {
      return THEME.color.mediumSeaGreen
    }

    if (history.totalPV === 0) {
      return THEME.color.goldenPoppy
    }

    return THEME.color.maximumRed
  }

  if (!canSearch) {
    return (
      <Wrapper $align={!history.isLoading}>
        <HistoryText>Antécédents : {informationsMessage}</HistoryText>
      </Wrapper>
    )
  }

  return (
    <Wrapper $align={!history.isLoading}>
      <HistoryText>Antécédents:</HistoryText>

      {!history.isLoading && canSearch && (
        <>
          <InfractionsAndPV>
            <Icon.CircleFilled color={dotColor()} size={8} />
            {totalSuspicionOfInfractions === 0 && history.totalInfraction === 0 ? (
              <span>Pas d&apos;antécédent</span>
            ) : (
              <>
                <>
                  <BoldOrNormalText $isBold={totalSuspicionOfInfractions > 0}>
                    {totalSuspicionOfInfractions} {pluralize('signalement', totalSuspicionOfInfractions)}
                  </BoldOrNormalText>
                  <StyledTooltip
                    iconSize={16}
                    isSideWindow={reportingContext === ReportingContext.SIDE_WINDOW || isReadOnly}
                    orientation="TOP_LEFT"
                  >
                    <span>Seul les signalements avec suspicion d&apos;infraction sont comptabilisés ici</span>
                  </StyledTooltip>
                  ,
                </>
                <BoldOrNormalText $isBold={history.totalInfraction > 0}>
                  {history.totalInfraction} {pluralize('infraction', history.totalInfraction)},
                </BoldOrNormalText>
                <BoldOrNormalText $isBold={history.totalPV > 0}>{history.totalPV} PV</BoldOrNormalText>
              </>
            )}
          </InfractionsAndPV>

          {history.themes.length > 0 && (
            <StyledTooltip
              isSideWindow={reportingContext === ReportingContext.SIDE_WINDOW || isReadOnly}
              linkText="En savoir plus"
              orientation="TOP_LEFT"
            >
              <Header as="header">Thématiques&nbsp;: </Header>
              <ul>
                {history.themes.map(theme => (
                  <li key={theme}>{theme}</li>
                ))}
              </ul>
            </StyledTooltip>
          )}
        </>
      )}
      {history.isLoading && <LoadingIcon />}
    </Wrapper>
  )
}

const Wrapper = styled.div<{ $align: boolean }>`
  align-items: center;
  color: ${({ theme }) => theme.color.slateGray};
  display: flex;
  font-size: 11px;
  gap: 8px;
  ${p => (p.$align ? 'justify-content: start;' : 'justify-content: space-between;')}
`
const InfractionsAndPV = styled.span`
  align-items: center;
  color: black;
  display: flex;
  font-size: 13px;
  gap: 5px;
`

const BoldOrNormalText = styled.span<{ $isBold: boolean }>`
  font-weight: ${p => (p.$isBold ? 'bold' : 'normal')};
`

const StyledTooltip = styled(Tooltip)`
  max-width: 215px;
  padding: 8px;
  z-index: 101 !important;
`
const Header = styled(Bold)`
  margin-bottom: 4px;
`
const HistoryText = styled(Italic)`
  align-items: center;
  display: flex;
  gap: 2px;
`

const LoadingIcon = styled(Icon.Reset)`
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  animation: spin 2s linear infinite;
  color: ${p => p.theme.color.charcoal};
  transform-origin: center;
`
