import { VesselIdentity } from '@features/Vessel/components/VesselResume/styles'
import { UNKNOWN } from '@features/Vessel/components/VesselResume/utils'
import { Vessel } from '@features/Vessel/types'
import { Icon, THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

type SummaryProps = {
  vessel: Vessel.Vessel
}

export function Summary({ vessel }: SummaryProps) {
  return (
    <>
      <VesselIdentity>
        <dt>MMSI</dt>
        <dd>{vessel.mmsi ?? UNKNOWN}</dd>
        <dt>Immatriculation</dt>
        <dd>{vessel.immatriculation ?? UNKNOWN}</dd>
        <dt>IMO</dt>
        <dd>{vessel.imo ?? UNKNOWN}</dd>
        <dt>Quartier d&apos;immat.</dt>
        <dd>{vessel.portOfRegistry ?? UNKNOWN}</dd>
      </VesselIdentity>
      <Mesurements>
        <dt>Longueur hors tout</dt>
        <dd>{vessel.length ? `${vessel.length}m` : UNKNOWN}</dd>
        <dt>Jauge brute (UMS)</dt>
        <dd>{vessel.umsGrossTonnage ? `${vessel.umsGrossTonnage}m³` : UNKNOWN}</dd>
      </Mesurements>
      <VesselType>
        <dt>Catégorie</dt>
        <Category>
          {vessel.category ? (
            <>
              {vessel.category === 'PRO' ? (
                <Icon.VesselPro color={THEME.color.slateGray} />
              ) : (
                <Icon.VesselLeisure color={THEME.color.slateGray} />
              )}

              {Vessel.CategoryLabel[vessel.category]}
            </>
          ) : (
            UNKNOWN
          )}
        </Category>
        <dt>Type</dt>
        <dd>{(vessel.category === 'PLA' ? vessel.leisureType : vessel.professionalType) ?? UNKNOWN}</dd>
        {vessel.commercialName && (
          <>
            <dt>Désignation commerciale</dt>
            <dd>{vessel.commercialName}</dd>
          </>
        )}
      </VesselType>
    </>
  )
}

const VesselType = styled(VesselIdentity)`
  grid-template-columns: 1fr 1.5fr;
`
const Mesurements = styled(VesselIdentity)`
  grid-template-columns: 1fr 1fr;
`
const Category = styled.dd`
  display: flex;
  gap: 4px;
`
