import { useField } from 'formik'
import styled from 'styled-components'

import type { Infraction } from '../../domain/entities/missions'

type VesselSearchDescriptionProps = {
  path: string
}

const UNKNOWN = 'Inconnu'

export function VesselSearchDescription({ path }: VesselSearchDescriptionProps) {
  const [{ value: infraction }] = useField<Infraction>(path)

  return (
    <Wrapper>
      <Value>
        {infraction.imo ?? UNKNOWN} <Description>(IMO)</Description>
      </Value>
      <Value>
        {infraction.mmsi ?? UNKNOWN} <Description>(MMSI)</Description>
      </Value>
      <Value>
        {infraction.registrationNumber ?? UNKNOWN} <Description>(Immat.)</Description>
      </Value>
      <Value>
        {infraction.vesselSize ? `${infraction.vesselSize}m` : UNKNOWN}
        <Description>(Taille)</Description>
      </Value>
      <Value>
        {infraction.vesselType ?? UNKNOWN} <Description>(Type)</Description>
      </Value>
      <Value>
        {infraction.controlledPersonIdentity ?? UNKNOWN}
        <Description>(Nom du capitaine)</Description>
      </Value>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  font-size: 13px;
  display: flex;
  gap: 4px 8px;
  flex-wrap: wrap;
`

const Description = styled.span`
  font-weight: 400;
`

const Value = styled.span`
  display: flex;
  flex-direction: row;
  gap: 4px;
  font-weight: 500;
`
