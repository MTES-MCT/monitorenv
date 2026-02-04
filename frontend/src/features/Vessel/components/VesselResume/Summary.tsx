import { VesselIdentity } from '@features/Vessel/components/VesselResume/styles'
import { Vessel } from '@features/Vessel/types'
import countries from 'i18n-iso-countries'
import styled from 'styled-components'

import { UNKNOWN } from '.'

type SummaryProps = {
  vessel: Vessel.Vessel
}

export function Summary({ vessel }: SummaryProps) {
  const countryName = vessel.flag ? countries.getName(vessel.flag.substring(0, 2).toLowerCase(), 'fr') : UNKNOWN

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
      <VesselIdentity>
        <dt>Longueur</dt>
        <dd>{vessel.length ? `${vessel.length}m` : UNKNOWN}</dd>
        <dt>Pavillon</dt>
        <dd>{countryName || UNKNOWN}</dd>
      </VesselIdentity>
      <VesselType>
        <dt>Catégorie</dt>
        <dd>{vessel.category ? Vessel.CategoryLabel[vessel.category] : UNKNOWN}</dd>
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
