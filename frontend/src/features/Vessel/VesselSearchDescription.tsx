import { useField } from 'formik'
import styled from 'styled-components'

type VesselSearchDescriptionProps = {
  path: string
}

const UNKNOWN = 'Inconnu'

export function VesselSearchDescription({ path }: VesselSearchDescriptionProps) {
  const [mmsi] = useField(`${path}.mmsi`)
  const [imo] = useField(`${path}.imo`)
  const [registrationNumber] = useField(`${path}.registrationNumber`)
  const [length] = useField(`${path}.length`)
  const [vesselType] = useField(`${path}.vesselType`)
  const [controlledPersonIdentity] = useField(`${path}.controlledPersonIdentity`)

  return (
    <Wrapper>
      <Value>
        {imo.value ?? UNKNOWN} <Description>(IMO)</Description>
      </Value>
      <Value>
        {mmsi.value ?? UNKNOWN} <Description>(MMSI)</Description>
      </Value>
      <Value>
        {registrationNumber.value ?? UNKNOWN} <Description>(Immat.)</Description>
      </Value>
      <Value>
        {length.value ? `${length.value}m` : UNKNOWN}
        <Description>(Taille)</Description>
      </Value>
      <Value>
        {vesselType.value ?? UNKNOWN} <Description>(Type)</Description>
      </Value>
      <Value>
        {controlledPersonIdentity.value ?? UNKNOWN}
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
