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

import { ReportingContext } from '../../../../domain/shared_slices/Global'

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

  const canSearch = reportingId && debouncedMmsi && debouncedMmsi.length >= NB_CHAR_MMSI

  const { data: envActions, isLoading: isLoadingEnvActions } = useGetEnvActionsByMmsiQuery(
    canSearch ? debouncedMmsi : skipToken
  )

  const { data: suspicionOfInfractions, isLoading: isLoadingSuspicions } = useGetSuspicionOfInfractionsQuery(
    canSearch ? { idsToExclude: isNewReporting(reportingId) ? [] : [+reportingId], mmsi: debouncedMmsi } : skipToken
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

  return (
    <Wrapper $align={!isLoading}>
      <span>Antécédents : {!canSearch ? informationsMessage : ''}</span>
      {!isLoading && canSearch && envActions && suspicionOfInfractions && (
        <>
          <InfractionsAndPV>
            <p>
              {suspicionOfInfractions?.ids.length} {pluralize('infraction', suspicionOfInfractions?.ids.length)}{' '}
              (suspicion)
            </p>
            <Icon.CircleFilled color={THEME.color.maximumRed} size={8} />
            <p>
              {totalInfraction} {pluralize('infraction', totalInfraction)}, {totalPV} PV
            </p>
          </InfractionsAndPV>
          {themes.length > 0 && (
            <StyledTooltip
              isSideWindow={reportingContext === ReportingContext.SIDE_WINDOW || isReadOnly}
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

const Wrapper = styled(Italic)<{ $align: boolean }>`
  font-size: 11px;
  color: ${({ theme }) => theme.color.slateGray};
  display: flex;
  align-items: center;
  gap: 16px;
  ${p => (p.$align ? 'justify-content: start;' : 'justify-content: space-between;')}
`
const InfractionsAndPV = styled.span`
  color: black;
  font-size: 13px;
  font-weight: bold;
  font-style: normal;
  display: flex;
  gap: 5px;
  align-items: center;
`

const StyledTooltip = styled(Tooltip)`
  z-index: 101 !important;
  padding: 8px;
`
const Header = styled(Bold)`
  margin-bottom: 4px;
`

const LoadingIcon = styled(Icon.Reset)`
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  animation: spin 2s linear infinite;
  transform-origin: center;
  color: ${p => p.theme.color.charcoal};
`
