import { useGetEnvActionsByMmsiQuery, useGetSuspicionOfOffenseQuery } from '@api/infractionsAPI'
import { Bold, Italic } from '@components/style'
import { Tooltip } from '@components/Tooltip'
import { getAllThemes, getTotalInfraction, getTotalPV } from '@features/Mission/utils'
import { Icon, pluralize, THEME } from '@mtes-mct/monitor-ui'
import { skipToken } from '@reduxjs/toolkit/query'
import { uniq } from 'lodash/fp'
import { useMemo } from 'react'
import styled from 'styled-components'
import { useDebounce } from 'use-debounce'

export function HistoryOfOffense({ mmsi }: { mmsi: string | undefined }) {
  const [debouncedMmsi] = useDebounce(mmsi, 200)
  const NB_CHAR_MMSI = 9

  const canSearch = debouncedMmsi && debouncedMmsi.length >= NB_CHAR_MMSI

  const { data: envActions, isLoading: isLoadingEnvActions } = useGetEnvActionsByMmsiQuery(
    canSearch ? debouncedMmsi : skipToken,
    { refetchOnMountOrArgChange: true }
  )

  const { data: suspicionOfOffense, isLoading: isLoadingSuspicions } = useGetSuspicionOfOffenseQuery(
    canSearch ? debouncedMmsi : skipToken,
    { refetchOnMountOrArgChange: true }
  )

  const totalInfraction = useMemo(() => getTotalInfraction(envActions ?? []), [envActions])

  const totalPV = useMemo(() => getTotalPV(envActions ?? []), [envActions])

  const themes = useMemo(
    () => uniq([...getAllThemes(envActions ?? []).map(theme => theme.name), ...(suspicionOfOffense?.themes ?? [])]),
    [envActions, suspicionOfOffense?.themes]
  )

  const isLoading = isLoadingEnvActions || isLoadingSuspicions

  return (
    <Wrapper $align={!isLoading}>
      <span>Antécedents : {!canSearch ? 'entrez un MMSI pour lancer la recherche' : ''}</span>
      {!isLoading && canSearch && envActions && suspicionOfOffense && (
        <>
          <InfractionAndPV>
            <p>{suspicionOfOffense?.amount} infractions (suspicion)</p>
            <Icon.CircleFilled color={THEME.color.maximumRed} size={8} />
            <p>
              {totalInfraction} {pluralize('infraction', totalInfraction)}, {totalPV} PV
            </p>
          </InfractionAndPV>
          {themes.length > 0 && (
            <StyledTooltip orientation="TOP_LEFT">
              <Header as="header">Thématiques&nbsp;: </Header>
              <ul>
                {themes.map(theme => (
                  <li>{theme}</li>
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
const InfractionAndPV = styled.span`
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
