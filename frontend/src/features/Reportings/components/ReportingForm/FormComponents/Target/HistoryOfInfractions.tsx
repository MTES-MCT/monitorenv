import { useGetEnvActionsByMmsiQuery, useGetSuspicionOfInfractionsQuery } from '@api/infractionsAPI'
import { Bold, Italic } from '@components/style'
import { Tooltip } from '@components/Tooltip'
import { getAllThemes, getTotalInfraction, getTotalPV } from '@features/Mission/utils'
import { isNewReporting } from '@features/Reportings/utils'
import { useAppSelector } from '@hooks/useAppSelector'
import { Icon, pluralize, THEME } from '@mtes-mct/monitor-ui'
import { skipToken } from '@reduxjs/toolkit/query'
import { uniq } from 'lodash/fp'
import { useMemo } from 'react'
import styled from 'styled-components'
import { useDebounce } from 'use-debounce'

import { ReportingContext } from '../../../../../../domain/shared_slices/Global'

export function HistoryOfInfractions({
  isReadOnly = false,
  mmsi,
  reportingId
}: {
  isReadOnly?: boolean
  mmsi: string | undefined
  reportingId: string | number | undefined
}) {
  const reportingContext =
    useAppSelector(state => (reportingId ? state.reporting.reportings[reportingId]?.context : undefined)) ??
    ReportingContext.MAP

  const [debouncedMmsi] = useDebounce(mmsi, 300)
  const NB_CHAR_MMSI = 9

  const canSearch = reportingId && debouncedMmsi && debouncedMmsi.length === NB_CHAR_MMSI

  const { data: envActions, isLoading: isLoadingEnvActions } = useGetEnvActionsByMmsiQuery(
    canSearch ? debouncedMmsi : skipToken
  )

  const { data: suspicionOfInfractions, isLoading: isLoadingSuspicions } = useGetSuspicionOfInfractionsQuery(
    canSearch ? { idToExclude: isNewReporting(reportingId) ? undefined : +reportingId, mmsi: debouncedMmsi } : skipToken
  )

  const totalInfraction = useMemo(() => getTotalInfraction(envActions ?? []), [envActions])

  const totalPV = useMemo(() => getTotalPV(envActions ?? []), [envActions])

  const themes = useMemo(
    () => uniq([...getAllThemes(envActions ?? []).map(theme => theme.name), ...(suspicionOfInfractions?.themes ?? [])]),
    [envActions, suspicionOfInfractions?.themes]
  )

  const isLoading = isLoadingEnvActions || isLoadingSuspicions

  const informationsMessage = isReadOnly
    ? 'ne peuvent être affichés que si un MMSI est rentré'
    : 'entrez un MMSI pour lancer la recherche'

  const totalSuspicionOfInfractions = suspicionOfInfractions?.ids.length ?? 0
  const dotColor = () => {
    if (totalInfraction === 0) {
      return THEME.color.mediumSeaGreen
    }

    if (totalPV === 0) {
      return THEME.color.goldenPoppy
    }

    return THEME.color.maximumRed
  }

  if (!canSearch) {
    return (
      <Wrapper $align={!isLoading}>
        <HistoryText>Antécédents : {informationsMessage}</HistoryText>
      </Wrapper>
    )
  }

  return (
    <Wrapper $align={!isLoading}>
      <HistoryText>
        Antécédents
        <StyledTooltip
          iconSize={16}
          isSideWindow={reportingContext === ReportingContext.SIDE_WINDOW || isReadOnly}
          orientation="TOP_LEFT"
        >
          <span>Seul les signalements avec suspicion d&apos;infraction sont comptabilisés ici</span>
        </StyledTooltip>
        :
      </HistoryText>

      {!isLoading && canSearch && (
        <>
          <InfractionsAndPV>
            <Icon.CircleFilled color={dotColor()} size={8} />
            {totalSuspicionOfInfractions === 0 && totalInfraction === 0 ? (
              <span>Pas d&apos;antécédent</span>
            ) : (
              <>
                <BoldOrNormalText $isBold={totalSuspicionOfInfractions > 0}>
                  {totalSuspicionOfInfractions} {pluralize('signalement', totalSuspicionOfInfractions)},
                </BoldOrNormalText>
                <BoldOrNormalText $isBold={totalInfraction > 0}>
                  {totalInfraction} {pluralize('infraction', totalInfraction)},
                </BoldOrNormalText>
                <BoldOrNormalText $isBold={totalPV > 0}>{totalPV} PV</BoldOrNormalText>
              </>
            )}
          </InfractionsAndPV>

          {themes.length > 0 && (
            <StyledTooltip
              isSideWindow={reportingContext === ReportingContext.SIDE_WINDOW || isReadOnly}
              linkText="En savoir plus"
              orientation="TOP_LEFT"
            >
              <Header as="header">Thématiques&nbsp;: </Header>
              <ul>
                {themes.map(theme => (
                  <li key={theme}>{theme}</li>
                ))}
              </ul>
            </StyledTooltip>
          )}
        </>
      )}
      {isLoading && <LoadingIcon />}
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
