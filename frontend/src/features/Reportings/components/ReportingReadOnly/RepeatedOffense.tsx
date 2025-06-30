import { useGetEnvActionsByMmsiQuery } from '@api/infractionsAPI'
import { Bold } from '@components/style'
import { Tooltip } from '@components/Tooltip'
import { getAllThemes, getTotalInfraction, getTotalPV } from '@features/Dashboard/components/Pdf/NearbyUnits/utils'
import { Icon, pluralize, THEME } from '@mtes-mct/monitor-ui'
import { skipToken } from '@reduxjs/toolkit/query'
import { useMemo } from 'react'
import styled from 'styled-components'
import { useDebounce } from 'use-debounce'

export function RepeatedOffense({ mmsi }: { mmsi: string | undefined }) {
  const [debouncedMmsi] = useDebounce(mmsi, 200)

  const NB_CHAR_MMSI = 9
  const { data: envActions, isLoading } = useGetEnvActionsByMmsiQuery(
    debouncedMmsi && debouncedMmsi.length >= NB_CHAR_MMSI ? debouncedMmsi : skipToken
  )

  const totalInfraction = useMemo(() => getTotalInfraction(envActions ?? []), [envActions])

  const totalPV = useMemo(() => getTotalPV(envActions ?? []), [envActions])

  const themes = useMemo(() => getAllThemes(envActions ?? []), [envActions])

  return (
    <Wrapper>
      <span>
        Antécedents :{' '}
        {!debouncedMmsi || debouncedMmsi?.length < NB_CHAR_MMSI ? 'entrez un MMSI pour lancer la recherche' : ''}
      </span>
      {!isLoading && debouncedMmsi && debouncedMmsi?.length >= NB_CHAR_MMSI && envActions && (
        <>
          <InfractionAndPV>
            {/*  TODO: get reportings infractions  */}
            <p>4 infractions (suspicion)</p>
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
                  <li style={{ width: '100%' }}>{theme.name}</li>
                ))}
              </ul>
            </StyledTooltip>
          )}
        </>
      )}
      {isLoading && <span>Loading</span>}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  font-style: italic;
  font-size: 11px;
  color: ${({ theme }) => theme.color.slateGray};
  display: flex;
  align-items: center;
  justify-content: space-between;
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
